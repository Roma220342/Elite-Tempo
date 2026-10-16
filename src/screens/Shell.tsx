import type { ReactNode } from 'react'
import { StatusBar } from './StatusBar'

/* Status bar (402x62) is only drawn inside the desktop device frame; on a phone the real one is used */
export function Shell({ children, bottom = 36 }: { children: ReactNode; bottom?: number }) {
  return (
    <div className="shell">
      <StatusBar />
      <div className="body" style={{ ['--body-bottom' as string]: `${bottom}px` }}>{children}</div>
    </div>
  )
}

/* Timeline with markers: dot 8, line 2, 20 to text */
export function Moment({ title, text, first, last }: { title: string; text: string; first?: boolean; last?: boolean }) {
  return (
    <div className="moment">
      <div className="moment__marker">
        <i className="moment__line" style={{ height: 10, opacity: first ? 0 : 1 }} />
        <i className="moment__dot" />
        <i className="moment__line" style={{ flex: 1, opacity: last ? 0 : 1 }} />
      </div>
      <div className="moment__text">
        <div className="t-title-2">{title}</div>
        <div className="t-body moment__sub">{text}</div>
      </div>
    </div>
  )
}

export function Segment({ label, height }: { label?: string; height?: number | string }) {
  return (
    <div className="segment" style={height != null ? { height, flex: 'none' } : undefined}>
      <div className="moment__marker"><i className="moment__line" style={{ flex: 1 }} /></div>
      {label && <span className="t-footnote segment__label">{label}</span>}
    </div>
  )
}
