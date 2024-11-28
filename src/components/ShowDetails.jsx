// src/components/ShowDetails.jsx
import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';

const ShowDetails = ({ show, onPlayEpisode, onAddToFavourites }) => {
  const [selectedSeason, setSelectedSeason] = useState(show.seasons[0]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <img 
          src={show.image} 
          alt={show.title} 
          className="w-1/3 mr-4 rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold">{show.title}</h1>
          <p>{show.description}</p>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl mb-2">Seasons</h2>
        <div className="flex space-x-2 mb-4">
          {show.seasons.map(season => (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season)}
              className={`px-4 py-2 rounded ${
                selectedSeason.id === season.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
              }`}
            >
              Season {season.number}
            </button>
          ))}
        </div>

        <div>
          <h3 className="text-xl mb-2">Episodes</h3>
          {selectedSeason.episodes.map(episode => (
            <div 
              key={episode.id} 
              className="flex justify-between items-center p-2 border-b"
            >
              <span>{episode.title}</span>
              <div>
                <button 
                  onClick={() => onPlayEpisode(episode)}
                  className="mr-2 bg-green-500 text-white px-3 py-1 rounded"
                >
                  Play
                </button>
                <button 
                  onClick={() => onAddToFavourites(episode)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Favourite
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;