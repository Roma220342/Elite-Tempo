import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Theme: ?theme=light|dark, otherwise follow the system
const q = new URLSearchParams(location.search).get('theme')
document.documentElement.dataset.theme = q === 'light' || q === 'dark' ? q : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'

if (!/Mac|iPhone|iPad|iPod/.test(navigator.userAgent)) document.documentElement.dataset.font = 'inter'

// Desktop: scale the 450x920 bezel to fit the window
const fit = () => document.documentElement.style.setProperty('--fit', String(Math.min(1, (innerHeight - 32) / 920, (innerWidth - 32) / 450)))
fit()
addEventListener('resize', fit)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
