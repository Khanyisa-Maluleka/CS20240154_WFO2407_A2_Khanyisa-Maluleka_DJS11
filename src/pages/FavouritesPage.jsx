import React, { useState } from 'react';
import { useFavourites } from '../context/FavouritesContext';
import { useAudio } from '../context/AudioContext';
import { formatDateTime } from '../utils/sorting';

function FavouritesPage() {
  const { favourites, removeFavourite, sortFavourites } = useFavourites();
  const { playEpisode } = useAudio();
  const [sortOption, setSortOption] = useState('recent');

  const handleSort = (option) => {
    setSortOption(option);
    sortFavourites(option);
  };

  return (
    <div className="favourites-page">
      <h1>My Favourite Episodes</h1>
      
      <div className="sort-controls">
        <label>Sort By:</label>
        <select 
          value={sortOption} 
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="recent">Most Recently Added</option>
          <option value="oldest">Least Recently Added</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      <div className="favourites-list">
        {favourites.map(episode => (
          <div key={episode.id} className="favourite-item">
            <div className="episode-details">
              <h3>{episode.title}</h3>
              <p>Added: {formatDateTime(episode.addedAt)}</p>
            </div>
            <div className="episode-actions">
              <button onClick={() => playEpisode(episode)}>
                Play Episode
              </button>
              <button 
                onClick={() => removeFavourite(episode.id)}
                className="remove-favourite"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}