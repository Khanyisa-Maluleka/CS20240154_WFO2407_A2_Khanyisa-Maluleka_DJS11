import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner-circle"></div>
      <p className="spinner-text">{text}</p>
    </div>
  );
};

export default LoadingSpinner;