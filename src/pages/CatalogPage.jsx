import React, { useState, useEffect } from 'react';
import { fetchPreviews } from '../utils/api';
import { sortShowsAlphabetically, sortShowsByUpdateDate } from '../utils/sorting';
import ShowPreview from '../components/ShowPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import Fuse from 'fuse.js';

const CatalogPage = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('titleAsc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [availableGenres, setAvailableGenres] = useState(['All']);
  const [fuse, setFuse] = useState(null);

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
    let filtered = shows;

    if (selectedGenre !== 'All') {
      filtered = shows.filter(show => 
        show.genres && show.genres.some(genre => 
          String(genre).toLowerCase() === selectedGenre.toLowerCase()
        )
      );
    }

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

  if (isLoading) {
    return <LoadingSpinner text="Loading Podcasts..." />;
  }

  return (
    <div className="catalog-container">
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
              {genre === 'All' ? 'All Genres' : `Genre: ${genre}`}
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

      <div className="shows-grid">
        {filteredShows.map(show => (
          <ShowPreview key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;