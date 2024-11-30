import React, { useState, useEffect } from 'react';
import { fetchPreviews } from '../utils/api';
import { sortShowsAlphabetically, sortShowsByUpdateDate } from '../utils/sorting';
import ShowPreview from '../components/ShowPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('titleAsc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const loadShows = async () => {
      setIsLoading(true);
      const previews = await fetchPreviews();
      const sortedShows = sortShowsAlphabetically(previews, true);
      setShows(sortedShows);
      setFilteredShows(sortedShows);
      setIsLoading(false);
    };
    loadShows();
  }, []);

  useEffect(() => {
    const filtered = shows.filter(show =>
      show.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredShows(filtered);
  }, [searchQuery, shows]);

  const handleSort = (option) => {
    setSortOption(option);
    let sortedShows;
    switch(option) {
      case 'titleAsc':
        sortedShows = sortShowsAlphabetically(filteredShows, true);
        break;
      case 'titleDesc':
        sortedShows = sortShowsAlphabetically(filteredShows, false);
        break;
      case 'recentlyUpdated':
        sortedShows = sortShowsByUpdateDate(filteredShows, true);
        break;
      case 'oldestUpdated':
        sortedShows = sortShowsByUpdateDate(filteredShows, false);
        break;
      default:
        sortedShows = filteredShows;
    }
    setFilteredShows(sortedShows);
  };

  const nextSlide = () => {
    setCurrentSlide(current => 
      current === Math.floor(shows.length / 4) - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(current => 
      current === 0 ? Math.floor(shows.length / 4) - 1 : current - 1
    );
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading Podcasts..." />;
  }

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Podcast Shows</h1>
      
      <div className="featured-carousel">
        <h2 className="featured-title">Featured Shows</h2>
        <div className="carousel-container">
          <button 
            onClick={prevSlide}
            className="carousel-button carousel-button-prev"
          >
            <ChevronLeft className="carousel-icon" />
          </button>
          <div className="carousel-content">
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {shows.slice(0, 8).map(show => (
                <div key={show.id} className="carousel-item">
                  <ShowPreview show={show} />
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={nextSlide}
            className="carousel-button carousel-button-next"
          >
            <ChevronRight className="carousel-icon" />
          </button>
        </div>
      </div>

      <div className="homepage-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-container">
          <label htmlFor="sort" className="homepage-sort-label">Sort by:</label>
          <select 
            id="sort" 
            value={sortOption} 
            onChange={(e) => handleSort(e.target.value)}
            className="homepage-sort-select"
          >
            <option value="titleAsc">Title (A-Z)</option>
            <option value="titleDesc">Title (Z-A)</option>
            <option value="recentlyUpdated">Recently Updated</option>
            <option value="oldestUpdated">Oldest Updated</option>
          </select>
        </div>
      </div>

      <div className="homepage-shows-grid">
        {filteredShows.map(show => (
          <ShowPreview key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;