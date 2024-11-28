import React from 'react';

function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <p>Loading Podcasts...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;