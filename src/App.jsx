import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import { FavouritesProvider } from './context/FavouritesContext';

// Page Imports
import HomePage from './pages/HomePage';
import ShowPage from './pages/ShowPage';
import GenrePage from './pages/GenrePage';
import FavouritesPage from './pages/FavouritesPage';

// Component Imports
import AudioPlayer from './components/AudioPlayer';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <AudioProvider>
        <FavouritesProvider>
          <div className="app-container">
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/show/:id" element={<ShowPage />} />
                <Route path="/genre/:genreId" element={<GenrePage />} />
                <Route path="/favourites" element={<FavouritesPage />} />
              </Routes>
            </main>
            <AudioPlayer />
          </div>
        </FavouritesProvider>
      </AudioProvider>
    </Router>
  );
}

export default App;