import React, { useState } from 'react';
import { useFavourites } from '../context/FavouritesContext';
import { useProgress } from '../context/ProgressContext';

const FavouritesPage = () => {
  const { favourites, removeFromFavourites, sortFavourites } = useFavourites();
  const { getProgress } = useProgress();
  const [sortOption, setSortOption] = useState('default');

  // Get sorted favorites
  const sortedFavourites = sortOption !== 'default' ? sortFavourites(sortOption) : favourites;

  // Group episodes by show after sorting
  const groupedFavourites = sortedFavourites.reduce((acc, episode) => {
    if (!acc[episode.showId]) {
      acc[episode.showId] = {
        showTitle: episode.showTitle,
        season: episode.season,
        showId: episode.showId,
        latestAddedAt: episode.addedAt,
        episodes: []
      };
    }
    
    // Update show's latest added time if this episode is more recent
    if (new Date(episode.addedAt) > new Date(acc[episode.showId].latestAddedAt)) {
      acc[episode.showId].latestAddedAt = episode.addedAt;
    }
    
    const progress = getProgress(episode.episode, episode.showId);
    acc[episode.showId].episodes.push({
      ...episode,
      progress
    });
    
    return acc;
  }, {});

  // Convert to array and sort shows if needed
  const showsArray = Object.values(groupedFavourites).sort((a, b) => {
    if (sortOption === 'recentlyAdded') {
      return new Date(b.latestAddedAt) - new Date(a.latestAddedAt);
    }
    if (sortOption === 'oldestAdded') {
      return new Date(a.latestAddedAt) - new Date(b.latestAddedAt);
    }
    if (sortOption === 'titleAsc') {
      return a.showTitle.localeCompare(b.showTitle);
    }
    if (sortOption === 'titleDesc') {
      return b.showTitle.localeCompare(a.showTitle);
    }
    return 0;
  });

  return (
    <div className="favourites-container">
      <h1 className="favourites-title">Favourites</h1>
      
      <div className="favourites-sort">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="favourites-sort-select"
        >
          <option value="default">Default</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="recentlyAdded">Recently Added</option>
          <option value="oldestAdded">Oldest Added</option>
        </select>
      </div>

      {showsArray.length === 0 ? (
        <p className="favourites-empty">No favourites yet</p>
      ) : (
        <div className="favourites-list">
          {showsArray.map(showGroup => (
            <div key={showGroup.showId} className="show-group">
              <h2 className="show-title">{showGroup.showTitle}</h2>
              <h3 className="season-title">Season {showGroup.season}</h3>
              <div className="episode-list">
                {showGroup.episodes.map(episode => (
                  <div key={episode.uniqueId} className="favourites-item">
                    <div className="favourites-item-info">
                      <h4 className="episode-title">
                        Episode {episode.episode}: {episode.title}
                      </h4>
                      {episode.progress && (
                        <div className="episode-progress">
                          <div 
                            className="episode-progress-bar"
                            style={{ 
                              width: `${(episode.progress.timestamp / episode.progress.duration) * 100}%` 
                            }}
                          />
                          <span className="episode-timestamp">
                            {new Date(episode.progress.timestamp * 1000).toISOString().substr(14, 5)} / 
                            {new Date(episode.progress.duration * 1000).toISOString().substr(14, 5)}
                          </span>
                        </div>
                      )}
                      <p className="favourites-item-date">
                        Added: {new Date(episode.addedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromFavourites(episode.uniqueId)}
                      className="favourites-item-remove"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;