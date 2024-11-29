import React, { useState } from 'react';
import { useFavourites } from '../context/FavouritesContext';

const FavouritesPage = () => {
  const { favourites, removeFromFavourites } = useFavourites();
  const [sortOption, setSortOption] = useState('default');

  const sortedFavourites = React.useMemo(() => {
    switch (sortOption) {
      case 'titleAsc':
        return [...favourites].sort((a, b) => a.title.localeCompare(b.title));
      case 'titleDesc':
        return [...favourites].sort((a, b) => b.title.localeCompare(a.title));
      case 'recentlyAdded':
        return [...favourites].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      default:
        return favourites;
    }
  }, [favourites, sortOption]);

  return (
    <div className="favourites-container">
      <h1 className="favourites-title">Favourites</h1>
      
      <div className="favourites-sort">
        <label htmlFor="sort" className="favourites-sort-label">Sort by:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="favourites-sort-select"
        >
          <option value="default">Default</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="recentlyAdded">Recently Added</option>
        </select>
      </div>

      {sortedFavourites.length === 0 ? (
        <p className="favourites-empty">No favourites yet</p>
      ) : (
        <div className="favourites-list">
          {sortedFavourites.map(episode => (
            <div
              key={episode.id}
              className="favourites-item"
            >
              <div className="favourites-item-info">
                <h3 className="favourites-item-title">{episode.title}</h3>
                <p className="favourites-item-date">
                  Added: {new Date(episode.addedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => removeFromFavourites(episode.id)}
                className="favourites-item-remove"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
