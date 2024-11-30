import React, { createContext, useState, useContext, useEffect } from 'react';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('podcastProgress');
    console.log('Initial saved progress:', saved); 
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    console.log('Persisting progress to localStorage:', progress);
    localStorage.setItem('podcastProgress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (episodeId, showId, currentTime, duration) => {
    if (isNaN(currentTime) || isNaN(duration)) {
      console.error('Invalid progress values:', currentTime, duration); 
      return;
    }
    console.log('Updating progress:', { episodeId, showId, currentTime, duration }); 
    setProgress((prev) => ({
      ...prev,
      [`${showId}-${episodeId}`]: {
        timestamp: currentTime,
        duration,
        lastPlayed: new Date().toISOString(),
        completed: currentTime >= duration - 5,
      },
    }));
  };

  const getProgress = (episodeId, showId) => {
    const key = `${showId}-${episodeId}`;
    const savedProgress = progress[key] || {
      timestamp: 0,
      duration: 0,
      lastPlayed: null,
      completed: false,
    };
    console.log('Retrieving progress for:', key, savedProgress); 
    return savedProgress;
  };

  const resetProgress = () => {
    console.log('Resetting all progress'); 
    setProgress({});
    localStorage.removeItem('podcastProgress');
  };

  const getCompletedEpisodes = () => {
    const completed = Object.entries(progress)
      .filter(([_, value]) => value.completed)
      .map(([key]) => key);
    console.log('Completed episodes:', completed); 
    return completed;
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateProgress,
        getProgress,
        resetProgress,
        getCompletedEpisodes,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
