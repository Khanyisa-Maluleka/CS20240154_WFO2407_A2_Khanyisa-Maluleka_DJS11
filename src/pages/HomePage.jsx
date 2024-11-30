import React, { useState, useEffect } from 'react';
import { fetchPreviews } from '../utils/api';
import { sortShowsAlphabetically, sortShowsByUpdateDate } from '../utils/sorting';
import ShowPreview from '../components/ShowPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import Fuse from 'fuse.js';

const HomePage = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('titleAsc');
  const [searchTerm, setSearchTerm] = useState('');
  const [fuse, setFuse] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const loadShows = async () => {
      setIsLoading(true);
      const previews = await fetchPreviews();
      const sortedShows = sortShowsAlphabetically(previews, true);
      setShows(sortedShows);
      setFilteredShows(sortedShows);
      
      // Initialize Fuse for fuzzy search
      setFuse(new Fuse(sortedShows, {
        keys: ['title', 'description', 'genres'],
        threshold: 0.4,
        includeScore: true
      }));
      
      setIsLoading(false);
    };

    loadShows();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredShows(shows);
      return;
    }

    if (fuse) {
      const results = fuse.search(searchTerm);
      setFilteredShows(results.map(result => result.item));
    }
  }, [searchTerm, shows, fuse]);

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

  const getRecommendedShows = () => {
    return shows.slice(carouselIndex, carouselIndex + 3);
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 3) % Math.max(shows.length - 2, 1));
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => 
      prev - 3 < 0 ? Math.max(shows.length - 3, 0) : prev - 3
    );
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading Podcasts..." />;
  }

  return (
    <div className="homepage-container">
      <div className="recommendations-carousel">
        <button onClick={handlePrevCarousel} className="carousel-button">&lt;</button>
        <div className="carousel-content">
          {getRecommendedShows().map(show => (
            <ShowPreview key={show.id} show={show} isCarousel={true} />
          ))}
        </div>
        <button onClick={handleNextCarousel} className="carousel-button">&gt;</button>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search shows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={sortOption} 
          onChange={(e) => handleSort(e.target.value)}
          className="sort-select"
        >
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="recentlyUpdated">Recently Updated</option>
          <option value="oldestUpdated">Oldest Updated</option>
        </select>
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