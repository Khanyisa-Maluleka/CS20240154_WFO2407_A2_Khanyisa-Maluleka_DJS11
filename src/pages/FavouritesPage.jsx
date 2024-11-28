// src/pages/FavouritesPage.jsx
import React, { useState } from 'react';
import { useFavourites } from '../context/FavouritesContext';

const FavouritesPage = () => {
  const { favourites, removeFromFavourites } = useFavourites();
  const [sortOption, setSortOption] = useState('default');

  const sortedFavourites = React.useMemo(() => {
    switch(sortOption) {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Favourites</h1>
      
      <div className="mb-4">
        <label htmlFor="sort" className="mr-2">Sort by:</label>
        <select 
          id="sort" 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="default">Default</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="recentlyAdded">Recently Added</option>
        </select>
      </div>

      {sortedFavourites.length === 0 ? (
        <p className="text-gray-500">No favourites yet</p>
      ) : (
        <div className="space-y-4">
          {sortedFavourites.map(episode => (
            <div 
              key={episode.id} 
              className="flex justify-between items-center p-4 border rounded"
            >
              <div>
                <h3 className="font-bold">{episode.title}</h3>
                <p className="text-sm text-gray-600">
                  Added: {new Date(episode.addedAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => removeFromFavourites(episode.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
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