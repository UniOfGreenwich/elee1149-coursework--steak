import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LogInScreen from './LogInScreenComponent/LogInScreen.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LogInScreen />
  </StrictMode>,
)
