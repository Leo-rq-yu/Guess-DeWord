import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InsforgeProvider } from '@insforge/react';
import { LanguageProvider } from './context/LanguageContext';
import { GameProvider } from './context/GameContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InsforgeProvider
      baseUrl={import.meta.env.VITE_INSFORGE_URL || 'https://66a245jb.us-east.insforge.app'}
    >
      <LanguageProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </LanguageProvider>
    </InsforgeProvider>
  </StrictMode>
);
