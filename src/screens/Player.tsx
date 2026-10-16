import { useEffect, useState } from 'react'
import { Button, TopBar } from '../components'
import { tone } from '../audio'
import golfer from '../assets/golfer.svg'
import golferLight from '../assets/golfer-light.svg'
import { Shell } from './Shell'

type Phase = 'ready' | 'start' | 'top' | 'hit' | 'result'
const ORDER: Phase[] = ['ready', 'start', 'top', 'hit', 'result']

// Real tempo of the swing: 0.82 s back, 0.22 s down (3.7:1)
const BACK_MS = 820
const DOWN_MS = 220
const X = { start: 4, top: 289, hit: 366 } // dot centers on the 370px track

export function Player({ onBack, onSkip, onNext }: { onBack: () => void; onSkip: () => void; onNext: () => void }) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [marker, setMarker] = useState({ x: X.start, ms: 0 })
  const [run, setRun] = useState(0)

  useEffect(() => {
    setPhase('ready')
    setMarker({ x: X.start, ms: 0 })
    const t: number[] = []
    const at = (ms: number, fn: () => void) => t.push(window.setTimeout(fn, ms))
    at(700, () => { setPhase('start'); tone(0) })
    at(760, () => setMarker({ x: X.top, ms: BACK_MS }))
    at(700 + BACK_MS + 60, () => { setPhase('top'); tone(1); setMarker({ x: X.hit, ms: DOWN_MS }) })
    at(700 + BACK_MS + 60 + DOWN_MS, () => { setPhase('hit'); tone(2) })
    at(700 + BACK_MS + 60 + DOWN_MS + 900, () => setPhase('result'))
    return () => t.forEach(window.clearTimeout)
  }, [run])

  const reached = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p)
  const result = phase === 'result'
  const showMarker = phase === 'start' || phase === 'top' || phase === 'hit'
  const playedTo = result ? 366 : marker.x
  const tr = `${marker.ms}ms linear`
  const pc = (v: number) => `${(v / 370) * 100}%`

  return (
    <Shell>
      <div className="body__main">
        <TopBar trailing="skip" step={1} onBack={onBack} onTrailing={onSkip} />
        <div className="player">
          <div className="player__visual">
            <div className="player__title">
              <div className="t-title-2">Tiger Woods</div>
              <div className="t-footnote" style={{ color: 'var(--text-2)' }}>Driver at the 2000 Open</div>
            </div>
            <div className="hero">
              <div className="hero__box">
                <i className="hero__glow" />
                <i className="hero__glow hero__glow--hit" style={{ opacity: phase === 'hit' ? 1 : 0 }} />
                <img className="hero__dark" src={golfer} alt="" width={337.667} height={395.8} draggable={false} />
                <img className="hero__light" src={golferLight} alt="" width={337.667} height={395.8} draggable={false} />
              </div>
            </div>
          </div>
          <div className="player__bottom">
            <div className="slot">
              {result ? (
                <div className="slot__result">
                  <div className="t-number-xl">3.7:1</div>
                  <div className="t-footnote" style={{ color: 'var(--text-2-card)' }}>Tempo ratio</div>
                </div>
              ) : (
                <div className="t-body slot__hint">Listen for three tones</div>
              )}
            </div>
            <div className="tempo">
              <div className="tempo__labels t-footnote">
                <span style={{ left: 0 }} className={phase === 'start' ? 'is-on' : ''}>Start</span>
                <span style={{ left: '75.14%' }} className={phase === 'top' ? 'is-on' : ''}>Top</span>
                <span style={{ right: 0 }} className={phase === 'hit' ? 'is-on' : ''}>Hit</span>
              </div>
              <div className="tempo__bar">
                <i className="tempo__track" />
                <i className="tempo__played" style={{ width: pc(playedTo - 4), transition: `width ${tr}` }} />
                {(['start', 'top', 'hit'] as const).map(k => (
                  <i key={k} className={`tempo__dot${reached(k) ? ' is-on' : ''}`} style={{ left: `calc(${pc(X[k])} - 4px)` }} />
                ))}
                <i className={`tempo__now${phase === 'hit' ? ' is-hit' : ''}`}
                  style={{ left: `calc(${pc(marker.x)} - 6px)`, opacity: showMarker ? 1 : 0, transition: `left ${tr}, opacity .2s, background-color .2s, box-shadow .2s` }} />
                <span className={`t-number-s tempo__time${reached('top') ? ' is-on' : ''}`} style={{ left: pc(124) }}>0.82 s</span>
                <span className={`t-number-s tempo__time${reached('hit') ? ' is-on' : ''}`} style={{ left: pc(306) }}>0.22 s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="actions">
        <Button variant={result ? 'secondary' : 'disabled'} onClick={() => setRun(r => r + 1)}>Replay</Button>
        <Button variant={result ? 'primary' : 'disabled'} onClick={onNext}>Continue</Button>
      </div>
    </Shell>
  )
}
