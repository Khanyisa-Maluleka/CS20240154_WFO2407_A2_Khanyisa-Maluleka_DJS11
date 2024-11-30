import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchShowDetails } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const ShowPreview = ({ show, isCarousel = false }) => {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const loadGenres = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if genres are numbers
    if (show.genres && show.genres.length > 0) {
      if (typeof show.genres[0] === 'number') {
        loadGenres();
      } else {
        setGenres(show.genres);
        setIsLoading(false);
      }
    } else {
      setGenres(['N/A']);
      setIsLoading(false);
    }
  }, [show.id, show.genres]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Link 
      to={`/show/${show.id}`} 
      className={`show-preview ${isCarousel ? 'carousel-item' : ''}`}
    >
      <div className="image-container">
        {!imageLoaded && <LoadingSpinner text="Loading image..." />}
        <img 
          src={show.image} 
          alt={show.title} 
          className={`show-preview-image ${imageLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleImageLoad}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </div>
      <div className="show-preview-content">
        <h2 className="show-preview-title">{show.title}</h2>
        <div className="show-preview-details">
          <span>Seasons ({show.seasons})</span>
          <span>Updated: {new Date(show.updated).toLocaleDateString()}</span>
          <div className="genre-tags">
            {isLoading ? (
              <LoadingSpinner text="Loading genres..." />
            ) : (
              genres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShowPreview;