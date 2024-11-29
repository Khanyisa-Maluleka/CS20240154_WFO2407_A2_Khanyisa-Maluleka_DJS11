import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ episode, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.play();

    const updateProgress = () => {
      const progressPercent = Math.round((audio.currentTime / audio.duration) * 100);
      setProgress(progressPercent);
      
      // Save progress more frequently
      saveProgress(episode.id, progressPercent, episode.title);
    };

    audio.addEventListener('timeupdate', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      
      // Final save when component unmounts
      saveProgress(episode.id, progress, episode.title);
    };
  }, [episode]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const saveProgress = (episodeId, progressPercent, episodeTitle) => {
    try {
      const savedHistory = localStorage.getItem('listenHistory');
      let history = savedHistory ? JSON.parse(savedHistory) : [];

      const episodeIndex = history.findIndex((ep) => ep.id === episodeId);
      if (episodeIndex !== -1) {
        history[episodeIndex].progress = progressPercent;
      } else {
        history.push({ 
          id: episodeId, 
          title: episodeTitle, 
          progress: progressPercent 
        });
      }

      localStorage.setItem('listenHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving listen history:', error);
    }
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={episode.file} onEnded={onClose} />
      <div className="audio-player-info">
        <div className="audio-player-title">{episode.title}</div>
        <div className="audio-player-progress-bar">
          <div className="audio-player-progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="audio-player-controls">
        <button onClick={togglePlay} className="audio-player-btn audio-player-toggle">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={onClose} className="audio-player-btn audio-player-close">
          Close
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;