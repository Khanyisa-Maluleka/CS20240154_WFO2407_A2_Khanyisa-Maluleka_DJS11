import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGenre } from '../utils/api';
import { genreMap } from '../utils/genreMap.js';

const ShowPreview = ({ show }) => {
  const [genreNames, setGenreNames] = useState([]);

  useEffect(() => {
    const loadGenreNames = async () => {
      const genreData = await Promise.all(show.genres.map(fetchGenre));
      setGenreNames(genreData.map(genre => genreMap[genre.id] || 'N/A'));
    };
    loadGenreNames();
  }, [show.genres]);

  return (
    <Link to={`/show/${show.id}`} className="show-preview">
      <img src={show.image} alt={show.title} className="show-preview-image" />
      <div className="show-preview-content">
        <h2 className="show-preview-title">{show.title}</h2>
        <div className="show-preview-details">
          <span>Seasons: {show.seasons.length}</span>
          <span>Updated: {new Date(show.updated).toLocaleDateString()}</span>
          <span>{genreNames.join(', ')}</span>
        </div>
      </div>
    </Link>
  );
};

export default ShowPreview;