import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from './AudioPlayer';
import LoadingSpinner from './LoadingSpinner';
import { fetchShowDetails } from '../utils/api';
import { useProgress } from '../context/ProgressContext';
import { useAudio } from '../context/AudioContext';

const ShowDetails = ({ onAddToFavourites }) => {
  const [show, setShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { getProgress, getCompletedEpisodes } = useProgress();
  const { playEpisode } = useAudio();
  const completedEpisodes = getCompletedEpisodes();

  useEffect(() => {
    const loadShow = async () => {
      setIsLoading(true);
      try {
        const showData = await fetchShowDetails(id);
        if (showData) {
          setShow(showData);
          if (showData.seasons?.length > 0) {
            setSelectedSeason(showData.seasons[0]);
          }
        }
      } catch (error) {
        console.error('Error loading show:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShow();
  }, [id]);

  const handlePlayEpisode = (episode) => {
    if (!show) return;
    setCurrentEpisode(episode);
    playEpisode(episode, show.id);
  };

  const handleClosePlayer = () => {
    setCurrentEpisode(null);
  };

  const isEpisodeCompleted = (episode) => {
    if (!show) return false;
    return completedEpisodes.includes(`${show.id}-${episode.episode}`);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading show details..." />;
  }

  if (!show) {
    return <div>Show not found</div>;
  }

  return (
    <div className="show-details-container">
      <div className="show-header">
        <img src={show.image} alt={show.title} className="show-image" />
        <div>
          <h1 className="show-title">{show.title}</h1>
          <p>{show.description}</p>
        </div>
      </div>

      <div className="seasons-container">
        <h2 className="seasons-heading">Seasons</h2>
        <div className="season-buttons">
          {show.seasons.map((season, index) => (
            <button
              key={index}
              onClick={() => setSelectedSeason(season)}
              className={`season-button ${selectedSeason === season ? 'selected' : ''}`}
            >
              Season {index + 1} ({season.episodes.length})
            </button>
          ))}
        </div>

        {selectedSeason && (
          <div>
            <h3 className="episodes-heading">Episodes</h3>
            {selectedSeason.episodes.map((episode) => {
              const progress = getProgress(episode.episode, show.id);
              const completed = isEpisodeCompleted(episode);

              return (
                <div key={episode.episode} className="episode-item">
                  <div className="episode-info">
                    <span className="episode-title">
                      {episode.title}
                      {completed && <span className="completed-badge">✓ Completed</span>}
                    </span>
                    {progress && (
                      <div className="episode-progress-container">
                        <div
                          className="episode-progress-bar"
                          style={{
                            width: `${(progress.timestamp / progress.duration) * 100}%`,
                          }}
                        />
                        <span className="episode-timestamp">
                          {formatTime(progress.timestamp)} / {formatTime(progress.duration)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="episode-buttons">
                    <button
                      onClick={() => handlePlayEpisode(episode)}
                      className="play-button"
                    >
                      {currentEpisode?.episode === episode.episode ? 'Playing' : 'Play'}
                    </button>
                    <button
                      onClick={() => onAddToFavourites(episode, show.id, show.title)}
                      className="favourite-button"
                    >
                      Favourite
                    </button>  
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {currentEpisode && (
        <AudioPlayer 
          episode={currentEpisode} 
          showId={show.id}
          onClose={handleClosePlayer} 
        />
      )}
    </div>
  );
};

export default ShowDetails;