import { useEffect, useState } from 'react'
import { Segmented } from './components'

type Theme = 'dark' | 'light'
const html = document.documentElement
const read = () => (html.dataset.theme === 'light' ? 'light' : 'dark') as Theme

/* Desktop-only panel beside the phone: theme switch and onboarding restart */
export function ProtoControls({ onRestart }: { onRestart: (theme: Theme) => void }) {
  const [theme, setTheme] = useState<Theme>(read)
  useEffect(() => {
    const o = new MutationObserver(() => setTheme(read()))
    o.observe(html, { attributes: true, attributeFilter: ['data-theme'] })
    return () => o.disconnect()
  }, [])
  const set = (t: Theme) => { html.dataset.theme = t }

  return (
    <aside className="proto-controls" aria-label="Prototype controls">
      <span className="proto-controls__label">Theme</span>
      <Segmented value={theme} onChange={set} options={[
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
      ]} />
      <button className="proto-controls__btn" onClick={() => onRestart(theme)}>Start onboarding</button>
    </aside>
  )
}
