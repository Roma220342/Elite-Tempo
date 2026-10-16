import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

/* Button 52 high, capsule */
export function Button({ variant = 'primary', children, ...p }:
  { variant?: 'primary' | 'secondary' | 'disabled'; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`btn btn--${variant}`} disabled={variant === 'disabled'} {...p}>
      <span className="t-headline">{children}</span>
    </button>
  )
}

/* Glass: only for native navigation. Rendered from the Figma PNG exports (74px box @4x, glyph included) */
import back from '../assets/glass/back.png'
import close from '../assets/glass/close.png'
import settings from '../assets/glass/settings.png'
import skip from '../assets/glass/skip.png'
const GLASS: Record<string, { src: string; w: number }> = {
  'chevron.left': { src: back, w: 74 }, xmark: { src: close, w: 74 }, gearshape: { src: settings, w: 74 }, skip: { src: skip, w: 94 },
}
export function GlassButton({ icon, label, onClick, ...p }:
  { icon?: string; label: string; wide?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const g = GLASS[icon ?? 'skip']
  return (
    <button className={`glass-btn${g.w > 74 ? ' glass-btn--wide' : ''}`} aria-label={label} onClick={onClick} {...p}>
      <img src={g.src} alt="" width={g.w} height={74} draggable={false} />
    </button>
  )
}

export function PageIndicator({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <div className="pager" aria-hidden>
      {Array.from({ length: total }, (_, i) => <i key={i} className={i + 1 === step ? 'is-on' : ''} />)}
    </div>
  )
}

export type Trailing = 'skip' | 'close' | 'none' | 'title'
export function TopBar({ trailing = 'skip', step, title, onBack, onTrailing, onSettings, showBack = true }:
  { trailing?: Trailing; step?: number; title?: string; onBack?: () => void; onTrailing?: () => void; onSettings?: () => void; showBack?: boolean }) {
  if (trailing === 'title') {
    return (
      <div className="topbar topbar--title">
        <h1 className="t-large-title">{title}</h1>
        <GlassButton icon="gearshape" label="Settings" onClick={onSettings} />
      </div>
    )
  }
  return (
    <div className="topbar">
      <div className="topbar__side">
        {trailing === 'close' ? <GlassButton icon="xmark" label="Close" onClick={onTrailing} />
          : showBack && <GlassButton icon="chevron.left" label="Back" onClick={onBack} />}
      </div>
      {step ? <PageIndicator step={step} /> : null}
      <div className="topbar__side topbar__side--end">
        {trailing === 'skip' && <GlassButton label="Skip" wide onClick={onTrailing} />}
      </div>
    </div>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag t-footnote">{children}</span>
}

export function Chip({ selected, children, onClick }: { selected?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button className={`chip${selected ? ' is-on' : ''}`} aria-pressed={selected} onClick={onClick}>
      <span className="chip__pill t-footnote-em">{children}</span>
    </button>
  )
}

export function Link({ icon, children, onClick }: { icon?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <button className="link t-footnote" onClick={onClick}>
      {icon && <Icon name={icon} />}<span>{children}</span>
    </button>
  )
}

export function Segmented<T extends string>({ options, value, onChange }:
  { options: { value: T; label: string; detail?: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="seg t-footnote" role="tablist">
      {options.map(o => (
        <button key={o.value} role="tab" aria-selected={o.value === value}
          className={`seg__item${o.value === value ? ' is-on' : ''}`} onClick={() => onChange(o.value)}>
          <b>{o.label}</b>{o.detail && <span>{o.detail}</span>}
        </button>
      ))}
    </div>
  )
}

/* Native pull-down menu: checkmark on the selected item */
export function PullDown<T extends string>({ options, value, onChange, label }:
  { options: T[]; value: T; onChange: (v: T) => void; label?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  useEffect(() => {
    if (!open) return
    const h = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', h)
    return () => document.removeEventListener('pointerdown', h)
  }, [open])
  return (
    <div className="pulldown" ref={ref}>
      <button className="pulldown__btn t-footnote-em" aria-haspopup="menu" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}>
        <span>{label ?? value}</span><Icon name="chevron.down" />
      </button>
      {open && (
        <ul className="menu glass-menu" role="menu" id={id}>
          {options.map(o => (
            <li key={o} role="menuitemradio" aria-checked={o === value}>
              <button className="menu__item t-body" onClick={() => { onChange(o); setOpen(false) }}>
                <span className="menu__check">{o === value && <Icon name="checkmark" />}</span><span>{o}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SwingCard({ ratio, club, day, starred, media }:
  { ratio: string; club: string; day: string; starred?: boolean; media?: string }) {
  return (
    <div className="swing-card" style={media ? { backgroundImage: `url(${media})` } : undefined}>
      <div className="swing-card__shade" />
      <div className="swing-card__top">{starred && <Icon name="star.fill" />}</div>
      <div className="swing-card__meta">
        <div className="t-title-2">{ratio}</div>
        <div className="swing-card__row t-footnote"><span>{club}</span><span>{day}</span></div>
      </div>
    </div>
  )
}

export type DayState = 'done' | 'pending' | 'today'
export function WeekTrack({ days }: { days: { letter: string; state: DayState }[] }) {
  return (
    <div className="week">
      <div className="week__line" />
      {days.map((d, i) => (
        <div key={i} className="week__day">
          <span className={`dot dot--${d.state}`} />
          <span className={d.state === 'today' ? 't-footnote-em week__today' : 't-footnote'}>{d.letter}</span>
        </div>
      ))}
    </div>
  )
}

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const [drag, setDrag] = useState(0)
  const start = useRef<number | null>(null)
  return (
    <div className={`sheet-layer${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet glass-sheet" role="dialog" aria-modal="true"
        style={drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined}
        onPointerDown={e => { if ((e.target as Element).closest('button')) return; start.current = e.clientY; (e.currentTarget as Element).setPointerCapture?.(e.pointerId) }}
        onPointerMove={e => { if (start.current != null) setDrag(Math.max(0, e.clientY - start.current)) }}
        onPointerUp={() => { if (drag > 90) onClose(); start.current = null; setDrag(0) }}
        onPointerCancel={() => { start.current = null; setDrag(0) }}>
        <div className="sheet__toolbar"><GlassButton icon="xmark" label="Close" onClick={onClose} /></div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  )
}

import tabbar from '../assets/glass/tabbar.png'
export type Tab = 'swings' | 'tempos' | 'routines' | 'me'
const ZONES: { id: Tab; label: string; x: number; w: number }[] = [
  { id: 'swings', label: 'My Swings', x: 20, w: 78 },
  { id: 'tempos', label: 'Pro tempos', x: 98, w: 67 },
  { id: 'routines', label: 'Routines', x: 165, w: 67 },
  { id: 'me', label: 'Me', x: 232, w: 73 },
]
/* Figma tab bar is a 402x95 PNG at the bottom of the screen; transparent buttons give the hit areas */
export function TabBar({ onChange, onAdd }: { active?: Tab; onChange: (t: Tab) => void; onAdd: () => void }) {
  return (
    <nav className="tabbar" aria-label="Tabs">
      <img src={tabbar} alt="" width={402} height={95} draggable={false} />
      {ZONES.map(z => (
        <button key={z.id} className="tabbar__zone" aria-label={z.label} style={{ left: z.x, width: z.w }} onClick={() => onChange(z.id)} />
      ))}
      <button className="tabbar__zone" aria-label="Add" style={{ left: 318, width: 64 }} onClick={onAdd} />
    </nav>
  )
}

export { Icon } from './Icon'
