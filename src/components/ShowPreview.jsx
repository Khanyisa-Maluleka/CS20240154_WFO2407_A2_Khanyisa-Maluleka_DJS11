// src/components/ShowPreview.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ShowPreview = ({ show }) => {
  return (
    <Link 
      to={`/show/${show.id}`} 
      className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <img 
        src={show.image} 
        alt={show.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{show.title}</h2>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Seasons: {show.seasons}</span>
          <span>Updated: {new Date(show.updated).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default ShowPreview;