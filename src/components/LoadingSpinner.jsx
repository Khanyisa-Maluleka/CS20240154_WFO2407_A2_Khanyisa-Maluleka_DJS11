import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      <p className="ml-4 text-xl">{text}</p>
    </div>
  );
};

export default LoadingSpinner;