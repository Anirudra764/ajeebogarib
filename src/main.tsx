import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AjeebDataProvider } from './context/AjeebDataContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AjeebDataProvider>
      <App />
    </AjeebDataProvider>
  </StrictMode>,
);
