import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LangProvider } from "./contexts/LangContext.jsx"; // ← ruta correcta
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import '@/styles.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
)
