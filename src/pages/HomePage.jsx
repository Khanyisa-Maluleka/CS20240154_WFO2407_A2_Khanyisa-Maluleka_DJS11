import React, { useState, useEffect } from 'react';
import { fetchPreviews } from '../utils/api';
import { sortShowsAlphabetically, sortShowsByUpdateDate } from '../utils/sorting';
import ShowPreview from '../components/ShowPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import Fuse from 'fuse.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('titleAsc');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [fuse, setFuse] = useState(null);

  // Load shows and initialize Fuse for fuzzy search
  useEffect(() => {
    const loadShows = async () => {
      setIsLoading(true);
      const previews = await fetchPreviews();
      const sortedShows = sortShowsAlphabetically(previews, true);
      setShows(sortedShows);

      setFuse(new Fuse(sortedShows, {
        keys: ['title', 'description', 'genres'],
        threshold: 0.4,
      }));

      setIsLoading(false);
    };
    loadShows();
  }, []);

  // Derive filtered and sorted shows
  const getFilteredAndSortedShows = () => {
    let filtered = shows;
    if (searchQuery && fuse) {
      filtered = fuse.search(searchQuery).map(result => result.item);
    }
    switch (sortOption) {
      case 'titleAsc':
        return sortShowsAlphabetically(filtered, true);
      case 'titleDesc':
        return sortShowsAlphabetically(filtered, false);
      case 'recentlyUpdated':
        return sortShowsByUpdateDate(filtered, true);
      case 'oldestUpdated':
        return sortShowsByUpdateDate(filtered, false);
      default:
        return filtered;
    }
  };

  const filteredAndSortedShows = getFilteredAndSortedShows();

  // Carousel logic
  const getCarouselShows = () => filteredAndSortedShows.slice(carouselIndex, carouselIndex + 4);

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 4) % Math.max(filteredAndSortedShows.length, 1));
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => 
      prev - 4 < 0 ? Math.max(filteredAndSortedShows.length - 4, 0) : prev - 4
    );
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading Podcasts..." />;
  }

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Podcast Shows</h1>
      
      {/* Featured Carousel */}
      <div className="featured-carousel">
        <h2 className="featured-title">Featured Shows</h2>
        <div className="carousel-container">
          <button 
            onClick={prevCarousel}
            className="carousel-button carousel-button-prev"
          >
            <ChevronLeft className="carousel-icon" />
          </button>
          <div className="carousel-content">
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {getCarouselShows().map(show => (
                <div key={show.id} className="carousel-item">
                  <ShowPreview show={show} />
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={nextCarousel}
            className="carousel-button carousel-button-next"
          >
            <ChevronRight className="carousel-icon" />
          </button>
        </div>
      </div>

      {/* Search and Sort Controls */}
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
            onChange={(e) => setSortOption(e.target.value)}
            className="homepage-sort-select"
          >
            <option value="titleAsc">Title (A-Z)</option>
            <option value="titleDesc">Title (Z-A)</option>
            <option value="recentlyUpdated">Recently Updated</option>
            <option value="oldestUpdated">Oldest Updated</option>
          </select>
        </div>
      </div>

      {/* Shows Grid */}
      <div className="homepage-shows-grid">
        {filteredAndSortedShows.map(show => (
          <ShowPreview key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
