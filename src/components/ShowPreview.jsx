import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchShowDetails } from '../utils/api';

const ShowPreview = ({ show, isCarousel = false }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
      // If show already has string genres, use them directly
      if (show.genres && show.genres.length > 0 && typeof show.genres[0] === 'string') {
        setGenres(show.genres);
        return;
      }
      
      // If we have numeric genres, fetch the full show details to get string genres
      try {
        const fullShow = await fetchShowDetails(show.id);
        if (fullShow && fullShow.genres && fullShow.genres.length > 0) {
          setGenres(fullShow.genres);
        } else {
          setGenres(['N/A']);
        }
      } catch (error) {
        console.error('Error loading genres:', error);
        setGenres(['N/A']);
      }
    };

    loadGenres();
  }, [show.id, show.genres]);

  return (
    <Link 
      to={`/show/${show.id}`} 
      className={`show-preview ${isCarousel ? 'carousel-item' : ''}`}
    >
      <img 
        src={show.image} 
        alt={show.title} 
        className="show-preview-image" 
      />
      <div className="show-preview-content">
        <h2 className="show-preview-title">{show.title}</h2>
        <div className="show-preview-details">
          <span>Seasons ({show.seasons})</span>
          <span>Updated: {new Date(show.updated).toLocaleDateString()}</span>
          <div className="genre-tags">
            {(genres.length === 0 ? ['N/A'] : genres).map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShowPreview;

