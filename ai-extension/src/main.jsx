import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import Popup from './popup/Popup'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
)
