import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/ibm-plex-sans-thai';
import '@fontsource/ibm-plex-sans-thai/300.css';
import '@fontsource/ibm-plex-sans-thai/700.css';
import '@fontsource/sarabun';
import '@fontsource/sarabun/300.css';
import '@fontsource/sarabun/600.css';
import '@fontsource/sarabun/700.css';
import './assets/css/index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import App from './boot/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
