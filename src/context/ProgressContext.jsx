import React, { createContext, useState, useContext, useEffect } from 'react';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('podcastProgress');
    console.log('Initial saved progress:', saved); // Debugging log
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    console.log('Persisting progress to localStorage:', progress); // Debugging log
    localStorage.setItem('podcastProgress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (episodeId, showId, currentTime, duration) => {
    if (isNaN(currentTime) || isNaN(duration)) {
      console.error('Invalid progress values:', currentTime, duration); // Debugging log
      return;
    }
    console.log('Updating progress:', { episodeId, showId, currentTime, duration }); // Debugging log
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
    console.log('Retrieving progress for:', key, savedProgress); // Debugging log
    return savedProgress;
  };

  const resetProgress = () => {
    console.log('Resetting all progress'); // Debugging log
    setProgress({});
    localStorage.removeItem('podcastProgress');
  };

  const getCompletedEpisodes = () => {
    const completed = Object.entries(progress)
      .filter(([_, value]) => value.completed)
      .map(([key]) => key);
    console.log('Completed episodes:', completed); // Debugging log
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
