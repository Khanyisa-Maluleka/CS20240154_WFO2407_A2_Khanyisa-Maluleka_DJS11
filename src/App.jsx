import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useFavourites } from './context/FavouritesContext';
import { useProgress } from './context/ProgressContext';
import { useAudio } from './context/AudioContext';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import FavouritesPage from './pages/FavouritesPage';
import ShowDetails from './components/ShowDetails';
import ShowGenre from './components/ShowGenre';
import AudioPlayer from './components/AudioPlayer';

const ResetButton = () => {
  const { resetProgress } = useProgress();
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your listening progress? This cannot be undone.')) {
      resetProgress();
    }
  };
  
  return (
    <button onClick={handleReset} className="reset-button">
      Reset Progress
    </button>
  );
};

function App() {
  const { currentEpisode, closePlayer, isPlaying } = useAudio();

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/catalog" className="navbar-title">Podcast App</Link>
            <div className="navbar-links">
              <Link to="/" className="nav-link">Discover</Link>
              <Link to="/favourites" className="nav-link">Favourites</Link>
              <ResetButton />
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/genre/:genreId" element={<ShowGenre />} />
          <Route path="/favourites" element={<FavouritesPage />} />
        </Routes>

        {currentEpisode && (
          <AudioPlayer
            episode={currentEpisode}
            onClose={closePlayer}
            isPlaying={isPlaying}
          />
        )}
      </div>
    </Router>
  );
}

export default App;