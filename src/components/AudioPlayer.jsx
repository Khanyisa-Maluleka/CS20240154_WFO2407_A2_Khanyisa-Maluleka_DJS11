import React from 'react';
import { useAudio } from '../context/AudioContext';

function AudioPlayer() {
  const { 
    currentEpisode, 
    isPlaying, 
    progress, 
    playEpisode, 
    pauseEpisode 
  } = useAudio();

  if (!currentEpisode) return null;

  return (
    <div className="audio-player">
      <div className="episode-info">
        <h3>{currentEpisode.title}</h3>
        <p>{currentEpisode.show}</p>
      </div>
      <div className="player-controls">
        <button onClick={isPlaying ? pauseEpisode : () => playEpisode(currentEpisode)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{width: `${progress}%`}}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;