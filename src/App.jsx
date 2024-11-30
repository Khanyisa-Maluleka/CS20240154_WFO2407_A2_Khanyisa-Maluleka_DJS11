import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { useFavourites } from './context/FavouritesContext';
import { useProgress } from './context/ProgressContext';
import { useAudio } from './context/AudioContext';

import HomePage from './pages/HomePage';
import FavouritesPage from './pages/FavouritesPage';
import ShowDetails from './components/ShowDetails';
import ShowGenre from './components/ShowGenre';
import AudioPlayer from './components/AudioPlayer';
import LoadingSpinner from './components/LoadingSpinner';

import { fetchShowDetails } from './utils/api';

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

function ShowDetailsPage() {
  const { id } = useParams();
  const { addToFavourites } = useFavourites();
  const { playEpisode } = useAudio();
  const [currentShow, setCurrentShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <LoadingSpinner text="Loading show details..." />;
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-text">
          Error loading show: {error.message}
        </div>
      </div>
    );
  }

  const handlePlayEpisode = (episode) => {
    playEpisode(episode, id);
  };

  return (
    <ShowDetails
      show={currentShow}
      onPlayEpisode={handlePlayEpisode}
      onAddToFavourites={addToFavourites}
    />
  );
}

function App() {
  const { currentEpisode, closePlayer, isPlaying } = useAudio();

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-title">Podcast App</Link>
            <div className="navbar-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/favourites" className="nav-link">Favourites</Link>
              <ResetButton />
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/show/:id" element={<ShowDetailsPage />} />
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