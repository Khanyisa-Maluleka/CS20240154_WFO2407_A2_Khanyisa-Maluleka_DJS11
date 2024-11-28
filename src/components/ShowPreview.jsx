import React from 'react';
import { Link } from 'react-router-dom';

const ShowPreview = ({ show }) => {
  return (
    <Link to={`/show/${show.id}`} className="show-preview">
      <img src={show.image} alt={show.title} className="show-preview-image" />
      <div className="show-preview-content">
        <h2 className="show-preview-title">{show.title}</h2>
        <div className="show-preview-details">
          <span>Seasons: {show.seasons}</span>
          <span>Updated: {new Date(show.updated).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default ShowPreview;
