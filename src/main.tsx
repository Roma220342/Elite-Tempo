import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Theme: ?theme=light|dark, otherwise follow the system
const q = new URLSearchParams(location.search).get('theme')
document.documentElement.dataset.theme = q === 'light' || q === 'dark' ? q : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'

if (!/Mac|iPhone|iPad|iPod/.test(navigator.userAgent)) document.documentElement.dataset.font = 'inter'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
