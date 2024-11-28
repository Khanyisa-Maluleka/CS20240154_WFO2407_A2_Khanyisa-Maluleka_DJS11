// src/components/ShowGenre.jsx
import React, { useState, useEffect } from 'react';
import { fetchGenre } from '../utils/api';
import ShowPreview from './ShowPreview';
import LoadingSpinner from './LoadingSpinner';

const ShowGenre = ({ genreId }) => {
  const [genre, setGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGenre = async () => {
      setIsLoading(true);
      const genreData = await fetchGenre(genreId);
      setGenre(genreData);
      setIsLoading(false);
    };

    loadGenre();
  }, [genreId]);

  if (isLoading) {
    return <LoadingSpinner text="Loading Genre..." />;
  }

  if (!genre) {
    return <div>No genre found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{genre.name} Podcasts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {genre.shows.map(show => (
          <ShowPreview key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

export default ShowGenre;