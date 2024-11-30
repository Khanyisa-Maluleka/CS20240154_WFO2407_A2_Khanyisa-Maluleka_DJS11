import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { FavouritesProvider } from './context/FavouritesContext.jsx';
import { ProgressProvider } from './context/ProgressContext';
import { AudioProvider } from './context/AudioContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AudioProvider>
      <ProgressProvider>
        <FavouritesProvider>
          <App />
        </FavouritesProvider>
      </ProgressProvider>
    </AudioProvider>
  </StrictMode>
);