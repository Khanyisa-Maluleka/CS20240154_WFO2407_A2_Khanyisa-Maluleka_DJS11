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
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [availableGenres, setAvailableGenres] = useState(['All']);
  const [fuse, setFuse] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const loadShows = async () => {
      setIsLoading(true);
      const previews = await fetchPreviews();
      const sortedShows = sortShowsAlphabetically(previews, true);
      setShows(sortedShows);
      
      // Collect all unique genres
      const genres = new Set(['All']);
      for (const show of previews) {
        if (show.genres && Array.isArray(show.genres)) {
          show.genres.forEach(genre => {
            if (genre && genre !== 'N/A') {
              genres.add(genre);
            }
          });
        }
      }
      setAvailableGenres(Array.from(genres).sort());
      
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

  // Combined filtering effect for both search and genre
  useEffect(() => {
    let filtered = shows;

    // Apply genre filter first if not 'All'
    if (selectedGenre !== 'All') {
      filtered = shows.filter(show => 
        show.genres && show.genres.some(genre => 
          String(genre).toLowerCase() === selectedGenre.toLowerCase()
        )
      );
    }

    // Then apply search filter if there's a search term
    if (searchTerm && fuse) {
      const searchResults = fuse.search(searchTerm);
      filtered = searchResults
        .map(result => result.item)
        .filter(show => 
          selectedGenre === 'All' || 
          (show.genres && show.genres.some(genre => 
            String(genre).toLowerCase() === selectedGenre.toLowerCase()
          ))
        );
    }

    setFilteredShows(filtered);
  }, [searchTerm, selectedGenre, shows, fuse]);

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
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="genre-select"
        >
          {availableGenres.map(genre => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        
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