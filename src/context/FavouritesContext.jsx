import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  sortShowsAlphabetically, 
  sortShowsByUpdateTime,
  formatDateTime 
} from '../utils/sorting';

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState(() => {
    const savedFavourites = localStorage.getItem('podcastFavourites');
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });

  useEffect(() => {
    localStorage.setItem('podcastFavourites', JSON.stringify(favourites));
  }, [favourites]);

  const addFavourite = (episode) => {
    const newFavourite = {
      ...episode,
      addedAt: new Date().toISOString()
    };

    setFavourites(prev => {
      // Prevent duplicates
      if (!prev.some(fav => fav.id === episode.id)) {
        return [...prev, newFavourite];
      }
      return prev;
    });
  };

  const removeFavourite = (episodeId) => {
    setFavourites(prev => 
      prev.filter(episode => episode.id !== episodeId)
    );
  };

  const sortFavourites = (sortType) => {
    let sortedFavourites = [...favourites];

    switch(sortType) {
      case 'az':
        sortedFavourites = sortShowsAlphabetically(sortedFavourites);
        break;
      case 'za':
        sortedFavourites = sortShowsAlphabetically(sortedFavourites, false);
        break;
      case 'oldest':
        sortedFavourites = sortShowsByUpdateTime(sortedFavourites, false);
        break;
      case 'recent':
      default:
        sortedFavourites = sortShowsByUpdateTime(sortedFavourites);
    }

    setFavourites(sortedFavourites);
  };

  return (
    <FavouritesContext.Provider value={{
      favourites,
      addFavourite,
      removeFavourite,
      sortFavourites
    }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => useContext(FavouritesContext);