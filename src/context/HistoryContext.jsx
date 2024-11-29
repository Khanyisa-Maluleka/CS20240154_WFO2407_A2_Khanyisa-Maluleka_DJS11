import React, { createContext, useContext, useState } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('listenHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const addEpisode = (episode) => {
    setHistory((prev) => {
      const updatedHistory = [...prev.filter((ep) => ep.id !== episode.id), episode];
      localStorage.setItem('listenHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  return (
    <HistoryContext.Provider value={{ history, addEpisode }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
