import React, { useState, useEffect } from 'react';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load user's listen history from storage
    const savedHistory = localStorage.getItem('listenHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const clearHistory = () => {
    // Remove user's listen history from storage
    localStorage.removeItem('listenHistory');
    setHistory([]);
  };

  return (
    <div>
      <h1>Listen History</h1>
      {history.length > 0 ? (
        <div>
          {history.map((episode) => (
            <div key={episode.id}>
              <h3>{episode.title}</h3>
            </div>
          ))}
          <button onClick={clearHistory}>Clear History</button>
        </div>
      ) : (
        <p>Your listen history is empty.</p>
      )}
    </div>
  );
};

export default HistoryPage;