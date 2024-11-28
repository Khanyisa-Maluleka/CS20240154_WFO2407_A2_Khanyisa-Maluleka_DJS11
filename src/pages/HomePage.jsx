import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchPreviews 
} from '../utils/api';
import { 
  sortShowsAlphabetically, 
  sortShowsByUpdateTime,
  formatDate 
} from '../utils/sorting';
import LoadingSpinner from '../components/LoadingSpinner';

function HomePage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('recent');

  useEffect(() => {
    const loadShows = async () => {
      const previews = await fetchPreviews();
      setShows(previews);
      setLoading(false);
    };

    loadShows();
  }, []);

  const handleSort = (option) => {
    setSortOption(option);
    let sortedShows;

    switch(option) {
      case 'az':
        sortedShows = sortShowsAlphabetically(shows);
        break;
      case 'za':
        sortedShows = sortShowsAlphabetically(shows, false);
        break;
      case 'oldest':
        sortedShows = sortShowsByUpdateTime(shows, false);
        break;
      case 'recent':
      default:
        sortedShows = sortShowsByUpdateTime(shows);
    }

    setShows(sortedShows);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="home-page">
      <h1>Podcast Shows</h1>
      
      <div className="sort-controls">
        <label>Sort By:</label>
        <select 
          value={sortOption} 
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="recent">Most Recently Updated</option>
          <option value="oldest">Least Recently Updated</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      <div className="shows-grid">
        {shows.map(show => (
          <Link 
            to={`/show/${show.id}`} 
            key={show.id} 
            className="show-preview"
          >
            <img 
              src={show.image} 
              alt={show.title} 
              className="show-image"
            />
            <div className="show-details">
              <h2>{show.title}</h2>
              <p>Seasons: {show.seasons}</p>
              <p>Updated: {formatDate(show.updated)}</p>
              <div className="show-genres">
                {show.genres && show.genres.map(genre => (
                  <span key={genre} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;