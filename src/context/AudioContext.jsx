import React, { createContext, useContext, useState, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showId, setShowId] = useState(null);

  // Handle beforeunload event when audio is playing
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = 'Audio is currently playing. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isPlaying]);

  const playEpisode = (episode, id) => {
    setCurrentEpisode(episode);
    setShowId(id);
    setIsPlaying(true);
  };

  const pauseEpisode = () => {
    setIsPlaying(false);
  };

  const closePlayer = () => {
    setCurrentEpisode(null);
    setShowId(null);
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider value={{
      currentEpisode,
      isPlaying,
      showId,
      playEpisode,
      pauseEpisode,
      closePlayer
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};