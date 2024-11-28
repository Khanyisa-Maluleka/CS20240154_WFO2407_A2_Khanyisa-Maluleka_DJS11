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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex items-center">
      <audio 
        ref={audioRef} 
        src={episode.file}
        onEnded={onClose}
      />
      <div className="flex-grow mr-4">
        <div>{episode.title}</div>
        <div className="w-full bg-gray-700 h-1 mt-2">
          <div 
            className="bg-blue-500 h-1" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div>
        <button 
          onClick={togglePlay} 
          className="mr-2 px-4 py-2 bg-blue-500 rounded"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button 
          onClick={onClose} 
          className="px-4 py-2 bg-red-500 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;