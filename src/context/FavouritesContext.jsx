import React, { createContext, useState, useContext, useEffect } from 'react';

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem('podcastFavourites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favourites from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('podcastFavourites', JSON.stringify(favourites));
    } catch (error) {
      console.error('Error saving favourites to localStorage:', error);
    }
  }, [favourites]);

  const addToFavourites = (episode, showId, showTitle) => {
    if (!episode || !showId || !showTitle) {
      console.error('Missing required parameters for addToFavourites');
      return;
    }

    const uniqueId = `${showId}-${episode.episode}`;
    
    setFavourites(prev => {
      if (prev.some(fav => fav.uniqueId === uniqueId)) {
        return prev;
      }

      return [...prev, {
        ...episode,
        uniqueId,
        showId,
        showTitle,
        addedAt: new Date().toISOString(),
        season: episode.season || 1
      }];
    });
  };

  const removeFromFavourites = (uniqueId) => {
    if (!uniqueId) {
      console.error('Missing uniqueId for removeFromFavourites');
      return;
    }
    setFavourites(prev => prev.filter(fav => fav.uniqueId !== uniqueId));
  };

  const sortFavourites = (sortType) => {
    const allFavourites = [...favourites];
    
    // First group by showId to find latest episode per show
    const showLatestDates = allFavourites.reduce((acc, episode) => {
      if (!acc[episode.showId] || new Date(acc[episode.showId]) < new Date(episode.addedAt)) {
        acc[episode.showId] = episode.addedAt;
      }
      return acc;
    }, {});

    // Sort based on type
    return allFavourites.sort((a, b) => {
      switch(sortType) {
        case 'titleAsc':
          // First compare show titles
          const showCompare = a.showTitle.localeCompare(b.showTitle);
          if (showCompare !== 0) return showCompare;
          // If same show, sort by addedAt
          return new Date(a.addedAt) - new Date(b.addedAt);
          
        case 'titleDesc':
          const showCompareDesc = b.showTitle.localeCompare(a.showTitle);
          if (showCompareDesc !== 0) return showCompareDesc;
          return new Date(b.addedAt) - new Date(a.addedAt);
          
        case 'recentlyAdded':
          // First compare show latest dates
          const aShowLatest = showLatestDates[a.showId];
          const bShowLatest = showLatestDates[b.showId];
          const showDateCompare = new Date(bShowLatest) - new Date(aShowLatest);
          if (showDateCompare !== 0) return showDateCompare;
          // If same show, sort by individual episode dates
          return new Date(b.addedAt) - new Date(a.addedAt);
          
        case 'oldestAdded':
          const aShowOldest = showLatestDates[a.showId];
          const bShowOldest = showLatestDates[b.showId];
          const showOldestCompare = new Date(aShowOldest) - new Date(bShowOldest);
          if (showOldestCompare !== 0) return showOldestCompare;
          return new Date(a.addedAt) - new Date(b.addedAt);
          
        default:
          return 0;
      }
    });
  };

  const getFavouritesByShow = (showId) => {
    return favourites.filter(fav => fav.showId === showId);
  };

  const isEpisodeFavourited = (showId, episodeId) => {
    return favourites.some(fav => fav.uniqueId === `${showId}-${episodeId}`);
  };

  const clearAllFavourites = () => {
    if (window.confirm('Are you sure you want to clear all favourites? This cannot be undone.')) {
      setFavourites([]);
    }
  };

  return (
    <FavouritesContext.Provider value={{ 
      favourites,
      addToFavourites,
      removeFromFavourites,
      sortFavourites,
      getFavouritesByShow,
      isEpisodeFavourited,
      clearAllFavourites
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