// AudioPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useAudio } from '../context/AudioContext'; // Add this import

const AudioPlayer = ({ episode, showId, onClose }) => {
  const audioRef = useRef(null);
  const { updateProgress, getProgress } = useProgress();
  const { isPlaying, pauseEpisode, playEpisode } = useAudio(); // Add this

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    
    // Load saved progress
    const savedProgress = getProgress(episode.episode, showId);
    if (savedProgress?.timestamp) {
      audio.currentTime = savedProgress.timestamp;
      setCurrentTime(savedProgress.timestamp);
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      // Only start playing after metadata is loaded
      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Playback failed:', error);
          pauseEpisode();
        });
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        updateProgress(episode.episode, showId, audio.currentTime, audio.duration);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [episode, showId, isPlaying]); // Add isPlaying to dependencies

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseEpisode();
    } else {
      playEpisode(episode, showId);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedValue = (x / rect.width) * audio.duration;
    audio.currentTime = clickedValue;
    setCurrentTime(clickedValue);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={episode.file}
        onEnded={() => {
          pauseEpisode();
          onClose();
        }}
      />
      <div className="audio-player-info">
        <div className="audio-player-title">{episode.title}</div>
        <div 
          className="audio-player-progress-bar"
          onClick={handleSeek}
        >
          <div
            className="audio-player-progress"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="audio-player-time">
          {formatTime(currentTime)} / {formatTime(duration)}
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