// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FavouritesProvider } from './context/FavouritesContext';

import HomePage from './pages/HomePage';
import FavouritesPage from './pages/FavouritesPage';
import ShowDetails from './components/ShowDetails';
import ShowGenre from './components/ShowGenre';
import AudioPlayer from './components/AudioPlayer';

import { fetchShowDetails } from './utils/api';
import { useFavourites } from './context/FavouritesContext';

function App() {
  const [currentShow, setCurrentShow] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const { addToFavourites } = useFavourites();

  const handleShowSelect = async (showId) => {
    const show = await fetchShowDetails(showId);
    setCurrentShow(show);
  };

  const handlePlayEpisode = (episode) => {
    setCurrentEpisode(episode);
  };

  const handleCloseAudio = () => {
    setCurrentEpisode(episode);
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
            element={
              <ShowDetails 
                show={currentShow} 
                onPlayEpisode={handlePlayEpisode}
                onAddToFavourites={addToFavourites}
              />
            } 
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