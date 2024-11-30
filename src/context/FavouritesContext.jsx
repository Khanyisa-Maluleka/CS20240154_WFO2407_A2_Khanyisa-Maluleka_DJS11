import React, { createContext, useState, useContext, useEffect } from 'react';

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem('podcastFavourites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('podcastFavourites', JSON.stringify(favourites));
  }, [favourites]);

  const addToFavourites = (episode, showId, showTitle) => {
    const uniqueId = `${showId}-${episode.episode}`;
    const existingFavourite = favourites.find(fav => fav.uniqueId === uniqueId);
    
    if (!existingFavourite) {
      setFavourites(prev => [...prev, {
        ...episode,
        uniqueId,
        showId,
        showTitle,
        addedAt: new Date().toISOString()
      }]);
    }
  };

  const removeFromFavourites = (uniqueId) => {
    setFavourites(prev => prev.filter(fav => fav.uniqueId !== uniqueId));
  };

  const sortFavourites = (sortType) => {
    switch(sortType) {
      case 'titleAsc':
        return [...favourites].sort((a, b) => a.title.localeCompare(b.title));
      case 'titleDesc':
        return [...favourites].sort((a, b) => b.title.localeCompare(a.title));
      case 'recentlyAdded':
        return [...favourites].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      case 'oldestAdded':
        return [...favourites].sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
      case 'show':
        return [...favourites].sort((a, b) => a.showTitle.localeCompare(b.showTitle));
      default:
        return favourites;
    }
  };

  return (
    <FavouritesContext.Provider value={{ 
      favourites, 
      addToFavourites, 
      removeFromFavourites,
      sortFavourites 
    }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};