import React, { createContext, useState, useContext, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const [progress, setProgress] = useState(0);

  const playEpisode = (episode) => {
    // Always use a placeholder audio for all episodes
    const placeholderAudio = 'https://example.com/placeholder-audio.mp3';
    
    if (currentEpisode?.id !== episode.id) {
      audio.src = placeholderAudio;
      setCurrentEpisode(episode);
    }
    
    audio.play();
    setIsPlaying(true);
  };

  const pauseEpisode = () => {
    audio.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    const updateProgress = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(progress) ? 0 : progress);
    };

    audio.addEventListener('timeupdate', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [audio]);

  // Prevent accidental page close when audio is playing
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPlaying]);

  return (
    <AudioContext.Provider value={{
      currentEpisode,
      isPlaying,
      progress,
      playEpisode,
      pauseEpisode
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);