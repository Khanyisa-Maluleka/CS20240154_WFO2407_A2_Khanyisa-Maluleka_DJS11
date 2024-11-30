import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ episode, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio.play();

    const updateProgress = () => {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      setProgress(progressPercent);
    };

    audio.addEventListener('timeupdate', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
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

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={episode.file}
        onEnded={onClose}
      />
      <div className="audio-player-info">
        <div className="audio-player-title">{episode.title}</div>
        <div className="audio-player-progress-bar">
          <div
            className="audio-player-progress"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="audio-player-controls">
        <button
          onClick={togglePlay}
          className="audio-player-btn audio-player-toggle"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={onClose}
          className="audio-player-btn audio-player-close"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
