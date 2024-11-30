import React, { useState } from 'react';
import { useFavourites } from '../context/FavouritesContext';
import { useProgress } from '../context/ProgressContext';

const FavouritesPage = () => {
  const { favourites, removeFromFavourites } = useFavourites();
  const { getProgress } = useProgress();
  const [sortOption, setSortOption] = useState('default');

  const groupedFavourites = React.useMemo(() => {
    const grouped = favourites.reduce((acc, episode) => {
      const key = `${episode.showId}-${episode.season}`;
      if (!acc[key]) {
        acc[key] = {
          showTitle: episode.showTitle,
          season: episode.season,
          episodes: []
        };
      }
      
      const progress = getProgress(episode.episode, episode.showId);
      acc[key].episodes.push({
        ...episode,
        progress
      });
      
      return acc;
    }, {});

    Object.values(grouped).forEach(group => {
      group.episodes.sort((a, b) => {
        switch (sortOption) {
          case 'titleAsc':
            return a.title.localeCompare(b.title);
          case 'titleDesc':
            return b.title.localeCompare(a.title);
          case 'Oldest Added':
            return new Date(a.addedAt) - new Date(b.addedAt);
          case 'recentlyAdded':
            return new Date(b.addedAt) - new Date(a.addedAt);
          default:
            return a.episode - b.episode;
        }
      });
    });

    return Object.entries(grouped).sort((a, b) => 
      a[1].showTitle.localeCompare(b[1].showTitle));
  }, [favourites, sortOption, getProgress]);

  return (
    <div className="favourites-container">
      <h1 className="favourites-title">Favourites</h1>
      
      <div className="favourites-sort">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="favourites-sort-select"
        >
          <option value="default">Episode Number</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="oldestAdded">Oldest Added</option>
          <option value="recentlyAdded">Recently Added</option>
        </select>
      </div>

      {groupedFavourites.length === 0 ? (
        <p className="favourites-empty">No favourites yet</p>
      ) : (
        <div className="favourites-list">
          {groupedFavourites.map(([key, group]) => (
            <div key={key} className="show-group">
              <h2 className="show-title">{group.showTitle}</h2>
              <h3 className="season-title">Season {group.season}</h3>
              <div className="episode-list">
                {group.episodes.map(episode => (
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