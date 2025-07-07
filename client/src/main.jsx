import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { MobileProvider } from '@/contexts/MobileContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MobileProvider>
      <App />
    </MobileProvider>
    <ToastContainer position='top-center' />
  </StrictMode>
);
