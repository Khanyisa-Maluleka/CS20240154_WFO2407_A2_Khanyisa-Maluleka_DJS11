import React, { useState, useEffect } from 'react';
import { fetchPreviews } from '../utils/api';
import ShowPreview from '../components/ShowPreview';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const loadShows = async () => {
      setIsLoading(true);
      const previews = await fetchPreviews();
      // Get random shows for featured content
      const shuffled = [...previews].sort(() => 0.5 - Math.random());
      setShows(shuffled);
      setIsLoading(false);
    };

    loadShows();
  }, []);

  const getCarouselShows = () => {
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
    return <LoadingSpinner text="Loading Featured Podcasts..." />;
  }

  return (
    <div className="homepage-container">
      <h1 className="featured-title">Featured Podcasts</h1>
      
      <div className="featured-carousel">
        <button onClick={handlePrevCarousel} className="carousel-button">&lt;</button>
        <div className="carousel-content">
          {getCarouselShows().map(show => (
            <ShowPreview key={show.id} show={show} isCarousel={true} />
          ))}
        </div>
        <button onClick={handleNextCarousel} className="carousel-button">&gt;</button>
      </div>

      <div className="trending-section">
        <h2 className="trending-title">Trending Now</h2>
        <div className="trending-grid">
          {shows.slice(0, 6).map(show => (
            <ShowPreview key={show.id} show={show} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;