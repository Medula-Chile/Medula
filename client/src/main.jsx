import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
//import Header from './components/header/Header.jsx'
//import AsideLeft from './components/asides/asideLeft.jsx'
//import AsideRight from './components/asides/asideright.jsx'
//import Historial from './components/historial_medico/03-historial.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
       <App />
  </StrictMode>,
)
