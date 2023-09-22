import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GameDbContextProvider } from 'game-ui/contexts/GameDbContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameDbContextProvider>
      <App />
    </GameDbContextProvider>
  </React.StrictMode>,
);
