import React, { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';

const ShowDetails = ({ show, onPlayEpisode, onAddToFavourites }) => {
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    if (show && show.seasons && show.seasons.length > 0) {
      
      setSelectedSeason(show.seasons[0]);
    }
  }, [show]);

  if (!show) {
    return <div>Loading...</div>;
  }

  return (
    <div className="show-details-container">
      <div className="show-header">
        <img
          src={show.image}
          alt={show.title}
          className="show-image"
        />
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
              Season {index + 1}
            </button>
          ))}
        </div>

        {selectedSeason && (
          <div>
            <h3 className="episodes-heading">Episodes</h3>
            {selectedSeason.episodes.map(episode => (
              <div
                key={episode.id}
                className="episode-item"
              >
                <span>{episode.title}</span>
                <div className="episode-buttons">
                  <button
                    onClick={() => onPlayEpisode(episode)}
                    className="play-button"
                  >
                    Play
                  </button>
                  <button
                    onClick={() => onAddToFavourites(episode)}
                    className="favourite-button"
                  >
                    Favourite
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowDetails;