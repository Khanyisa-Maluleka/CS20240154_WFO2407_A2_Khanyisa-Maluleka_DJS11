import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchShowDetails } from '../utils/api';
import { formatDate } from '../utils/sorting';
import { useAudio } from '../context/AudioContext';
import { useFavourites } from '../context/FavouritesContext';
import LoadingSpinner from '../components/LoadingSpinner';

function ShowPage() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const { playEpisode } = useAudio();
  const { addFavourite, favourites, removeFavourite } = useFavourites();

  useEffect(() => {
    const loadShowDetails = async () => {
      try {
        const details = await fetchShowDetails(id);
        setShow(details);
        setSelectedSeason(details.seasons[0]);
      } catch (error) {
        console.error('Failed to load show details', error);
      } finally {
        setLoading(false);
      }
    };

    loadShowDetails();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!show) return <div>Show not found</div>;

  const isFavourite = (episodeId) => 
    favourites.some(fav => fav.id === episodeId);

  const toggleFavourite = (episode) => {
    if (isFavourite(episode.id)) {
      removeFavourite(episode.id);
    } else {
      addFavourite(episode);
    }
  };

  return (
    <div className="show-details-container">
      <div className="show-header">
        <img 
          src={show.image} 
          alt={show.title} 
          className="show-large-image" 
        />
        <div className="show-info">
          <h1>{show.title}</h1>
          <p>Last Updated: {formatDate(show.updated)}</p>
          <div className="show-genres">
            {show.genres.map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>
          <p>{show.description}</p>
        </div>
      </div>

      <div className="seasons-selector">
        <h2>Seasons ({show.seasons.length})</h2>
        <div className="season-buttons">
          {show.seasons.map(season => (
            <button 
              key={season.id}
              onClick={() => setSelectedSeason(season)}
              className={selectedSeason?.id === season.id ? 'active' : ''}
            >
              Season {season.number}
            </button>
          ))}
        </div>
      </div>

      {selectedSeason && (
        <div className="season-episodes">
          <h2>Season {selectedSeason.number} Episodes</h2>
          <div className="episodes-grid">
            {selectedSeason.episodes.map(episode => (
              <div key={episode.id} className="episode-card">
                <img 
                  src={selectedSeason.image} 
                  alt={episode.title} 
                />
                <div className="episode-details">
                  <h3>{episode.title}</h3>
                  <p>{episode.description}</p>
                  <div className="episode-actions">
                    <button onClick={() => playEpisode(episode)}>
                      Play Episode
                    </button>
                    <button 
                      onClick={() => toggleFavourite(episode)}
                      className={isFavourite(episode.id) ? 'favourite-active' : ''}
                    >
                      {isFavourite(episode.id) ? 'Remove Favourite' : 'Add Favourite'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowPage;