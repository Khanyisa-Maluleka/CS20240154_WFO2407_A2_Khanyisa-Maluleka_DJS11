import React, { useState, useEffect } from 'react';
import { fetchGenre } from '../utils/api';
import { genreMap } from '../utils/genreMap';
import ShowPreview from './ShowPreview';
import LoadingSpinner from './LoadingSpinner';
import Fuse from 'fuse.js';

const ShowGenre = ({ genreId }) => {
  const [genre, setGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShows, setFilteredShows] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    const loadGenre = async () => {
      setIsLoading(true);
      const genreData = await fetchGenre(genreId);
      const genreInfo = {
        name: genreMap[genreId] || 'N/A',
        shows: genreData.shows,
      };
      setGenre(genreInfo);
      setFilteredShows(genreInfo.shows);
      
      setFuse(new Fuse(genreInfo.shows, {
        keys: ['title', 'description'],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2
      }));
      
      setIsLoading(false);
    };

    loadGenre();
  }, [genreId]);

  useEffect(() => {
    if (!searchTerm || !fuse) {
      setFilteredShows(genre?.shows || []);
      return;
    }

    const results = fuse.search(searchTerm);
    setFilteredShows(results.map(result => result.item));
  }, [searchTerm, genre, fuse]);

  if (isLoading) return <LoadingSpinner text="Loading Genre..." />;
  if (!genre) return <div className="show-genre-error">No genre found</div>;

  return (
    <div className="show-genre-container">
      <h1 className="show-genre-title">{genre.name} Podcasts</h1>
      
      <div className="show-genre-search">
        <input
          type="text"
          placeholder="Search by title or concepts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="show-genre-grid">
        {filteredShows.map(show => (
          <ShowPreview key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

export default ShowGenre;