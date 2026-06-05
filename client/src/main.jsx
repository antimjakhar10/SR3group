import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. Ye import kar
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. BrowserRouter ke andar App ko wrap kar */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)