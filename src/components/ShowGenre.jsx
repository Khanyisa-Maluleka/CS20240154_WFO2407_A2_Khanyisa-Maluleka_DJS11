import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ShowPreview from './ShowPreview';
import LoadingSpinner from './LoadingSpinner';
import Fuse from 'fuse.js';
import { fetchShowDetails } from '../utils/api';

const ShowGenre = () => {
  const { genreId } = useParams();
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShows, setFilteredShows] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [genreName, setGenreName] = useState('');

  useEffect(() => {
    const loadShows = async () => {
      try {
        setIsLoading(true);
        // First fetch all shows
        const response = await fetch('https://podcast-api.netlify.app/');
        const allShows = await response.json();
        
        // Get detailed info for the first show to determine genre format
        const sampleShow = await fetchShowDetails(allShows[0].id);
        
        // If we got string genres, filter using those
        if (sampleShow && typeof sampleShow.genres[0] === 'string') {
          const showsInGenre = allShows.filter(showPreview => 
            showPreview.genres.some(g => String(g).toLowerCase() === decodeURIComponent(genreId).toLowerCase())
          );
          setShows(showsInGenre);
          setGenreName(decodeURIComponent(genreId));
        } else {
          // If we got numeric genres, we'll need to fetch full details for shows
          const showsWithDetails = await Promise.all(
            allShows.filter(show => show.genres.includes(parseInt(genreId)))
              .map(show => fetchShowDetails(show.id))
          );
          setShows(showsWithDetails.filter(Boolean));
          
          // Get the genre name from the first show that has it
          const firstShowWithGenre = showsWithDetails.find(show => 
            show && show.genres && show.genres.length > 0
          );
          if (firstShowWithGenre) {
            setGenreName(firstShowWithGenre.genres[0]);
          }
        }

        setFilteredShows(shows);
        setFuse(new Fuse(shows, {
          keys: ['title', 'description'],
          threshold: 0.3,
          includeScore: true,
          minMatchCharLength: 2
        }));
      } catch (error) {
        console.error('Error loading genre shows:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShows();
  }, [genreId]);

  useEffect(() => {
    if (!searchTerm || !fuse) {
      setFilteredShows(shows);
      return;
    }

    const results = fuse.search(searchTerm);
    setFilteredShows(results.map(result => result.item));
  }, [searchTerm, shows, fuse]);

  if (isLoading) return <LoadingSpinner text="Loading Genre..." />;
  if (!shows.length) return <div className="show-genre-error">No shows found for this genre</div>;

  return (
    <div className="show-genre-container">
      <h1 className="show-genre-title">{genreName} Podcasts</h1>
      
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