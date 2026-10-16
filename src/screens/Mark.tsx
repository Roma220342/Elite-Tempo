import { useState } from 'react'
import { Button, TopBar } from '../components'
import { Shell } from './Shell'

// Moments of the sample swing in seconds; the video is 2.0 s long (185 px per second on 370 px)
const TIMES = [0.4, 1.36, 1.66] as const
const NAMES = ['Start', 'Top', 'Hit'] as const
const HINTS = [
  'Tap Start the moment the club moves back',
  'Tap Top when the club stops at the top',
  'Tap Hit when the club meets the ball',
]
const pct = (s: number) => `${(s / 2) * 100}%`

export function Mark({ onBack, onSkip, onNext }: { onBack: () => void; onSkip: () => void; onNext: () => void }) {
  const [step, setStep] = useState(0) // 0..2: waiting for that tap, 3: done
  const done = step === 3
  const head = done ? TIMES[2] : TIMES[step]
  const played = done ? TIMES[2] : step === 0 ? TIMES[0] : TIMES[step]

  return (
    <Shell>
      <div className="body__main">
        <TopBar trailing="skip" step={2} onBack={onBack} onTrailing={onSkip} />
        <div className="mark">
          <div className="mark__head">
            <div className="t-title-2">{done ? 'Swing marked' : 'Mark the swing'}</div>
            <div className="t-body" style={{ color: 'var(--text-2-card)' }}>
              {done ? 'Measured from the video, not a preset beat' : HINTS[step]}
            </div>
          </div>
          <div className="mark__body">
            <div className="video"><span className="t-footnote">Sample swing video</span></div>
            <div className="scrub">
              <i className="scrub__track" />
              <i className="scrub__played" style={{ width: pct(played) }} />
              {TIMES.map((t, i) => i < step && (
                <i key={i} className="scrub__dot" style={{ left: pct(t) }} />
              ))}
              <i className="scrub__head" style={{ left: pct(head) }} />
            </div>
            <div className="points">
              {NAMES.map((n, i) => {
                const marked = i < step
                const active = i === step
                return (
                  <button key={n} className={`point${marked ? ' is-marked' : ''}${active ? ' is-active' : ''}`}
                    disabled={!active} aria-label={`Mark ${n}`} onClick={() => setStep(s => s + 1)}>
                    <span className="t-headline">{n}</span>
                    {marked && <span className="t-number-s point__time">{TIMES[i].toFixed(2)} s</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="actions">
        <Button variant={done ? 'primary' : 'disabled'} onClick={onNext}>Continue</Button>
      </div>
    </Shell>
  )
}
