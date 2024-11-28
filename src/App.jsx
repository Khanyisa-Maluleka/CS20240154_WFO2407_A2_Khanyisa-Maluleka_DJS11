// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { FavouritesProvider } from './context/FavouritesContext';

import HomePage from './pages/HomePage';
import FavouritesPage from './pages/FavouritesPage';
import ShowDetails from './components/ShowDetails';
import ShowGenre from './components/ShowGenre';
import AudioPlayer from './components/AudioPlayer';

import { fetchShowDetails } from './utils/api';
import { useFavourites } from './context/FavouritesContext';

// Create a separate component to handle show details page with loading and error states
function ShowDetailsPage() {
  const [currentShow, setCurrentShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { addToFavourites } = useFavourites();

  const handlePlayEpisode = (episode) => {
    setCurrentEpisode(episode);
  };

  useEffect(() => {
    async function loadShowDetails() {
      try {
        setIsLoading(true);
        const show = await fetchShowDetails(id);
        
        if (show) {
          setCurrentShow(show);
          setError(null);
        } else {
          setError(new Error('Show not found'));
        }
      } catch (err) {
        console.error('Error fetching show details:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadShowDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-blue-600">Loading show details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-red-600">
          Error loading show: {error.message}
        </div>
      </div>
    );
  }

  return (
    <ShowDetails 
      show={currentShow} 
      onPlayEpisode={handlePlayEpisode}
      onAddToFavourites={addToFavourites}
    />
  );
}

function App() {
  const [currentEpisode, setCurrentEpisode] = useState(null);

  const handleCloseAudio = () => {
    setCurrentEpisode(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">Podcast App</Link>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/favourites" className="hover:underline">Favourites</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/show/:id" 
            element={<ShowDetailsPage />}
          />
          <Route 
            path="/genre/:genreId" 
            element={({ match }) => <ShowGenre genreId={match.params.genreId} />} 
          />
          <Route path="/favourites" element={<FavouritesPage />} />
        </Routes>

        {currentEpisode && (
          <AudioPlayer 
            episode={currentEpisode} 
            onClose={handleCloseAudio} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;