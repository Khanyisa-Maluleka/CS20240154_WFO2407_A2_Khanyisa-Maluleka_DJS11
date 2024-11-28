// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { fetchPreviews } from '../utils/api';
import { sortShowsAlphabetically, sortShowsByUpdateDate } from '../utils/sorting';
import ShowPreview from '../components/ShowPreview';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    const loadShows = async () => {
      setIsLoading(true);
      const previews = await fetchPreviews();
      setShows(previews);
      setIsLoading(false);
    };

    loadShows();
  }, []);

  const handleSort = (option) => {
    setSortOption(option);
    let sortedShows;
    switch(option) {
      case 'titleAsc':
        sortedShows = sortShowsAlphabetically(shows, true);
        break;
      case 'titleDesc':
        sortedShows = sortShowsAlphabetically(shows, false);
        break;
      case 'recentlyUpdated':
        sortedShows = sortShowsByUpdateDate(shows, true);
        break;
      case 'oldestUpdated':
        sortedShows = sortShowsByUpdateDate(shows, false);
        break;
      default:
        sortedShows = shows;
    }
    setShows(sortedShows);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading Podcasts..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Podcast Shows</h1>
      
      <div className="mb-4">
        <label htmlFor="sort" className="mr-2">Sort by:</label>
        <select 
          id="sort" 
          value={sortOption} 
          onChange={(e) => handleSort(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="default">Default</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="recentlyUpdated">Recently Updated</option>
          <option value="oldestUpdated">Oldest Updated</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.map(show => (
          <ShowPreview key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;