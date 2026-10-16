import { useState } from 'react'
import { Button, Icon, Link, Segmented, TopBar } from '../components'
import { Moment, Segment, Shell } from './Shell'

type Nav = { onBack: () => void; onSkip: () => void; onNext: () => void }

/* 02 Hear the tempo */
export function Hear({ onBack, onSkip, onNext }: Nav) {
  return (
    <Shell>
      <div className="body__main" style={{ gap: 24 }}>
        <div className="stack16">
          <TopBar trailing="skip" step={1} onBack={onBack} onTrailing={onSkip} />
          <Header title="Master your timing" text="Great swings share a rhythm: hear Tiger’s as three tones" />
        </div>
        <div className="photo">
          <span className="t-footnote photo__label">Photo</span>
          <i className="photo__fade" />
          <div className="photo__text">
            <div className="t-title-2">Tiger Woods</div>
            <div className="t-footnote" style={{ color: 'var(--text-2-card)' }}>2000 Open Championship</div>
          </div>
        </div>
      </div>
      <div className="actions">
        <Button onClick={onNext}><span className="btn__row"><Icon name="play.fill" height={15} />Play Tiger’s tempo</span></Button>
      </div>
    </Shell>
  )
}

function Header({ title, text }: { title: string; text: string }) {
  return (
    <div className="header">
      <h1 className="t-large-title">{title}</h1>
      <p className="t-body" style={{ color: 'var(--text-2-card)' }}>{text}</p>
    </div>
  )
}

/* 08 Mark – Intro */
export function MarkIntro({ onBack, onSkip, onNext }: Nav) {
  return (
    <Shell>
      <div className="body__main" style={{ gap: 24 }}>
        <div className="stack16">
          <TopBar trailing="skip" step={2} onBack={onBack} onTrailing={onSkip} />
          <Header title="Measure any swing" text="Mark three moments on video to get its tempo" />
        </div>
        <div className="timeline" style={{ paddingBottom: 28 }}>
          <Moment title="Start" text="The club starts back" first />
          <Segment label="Backswing" />
          <Moment title="Top" text="The club stops at the top" />
          <Segment label="Downswing" height={80} />
          <Moment title="Hit" text="The club meets the ball" last />
        </div>
      </div>
      <div className="actions"><Button onClick={onNext}>Try it</Button></div>
    </Shell>
  )
}

/* 13 Compare */
function Bar({ back, down, dim, labels }: { back: number; down: number; dim?: boolean; labels: [string, number][] }) {
  const pc = (v: number) => `${(v / 370) * 100}%`
  const c = dim ? 'var(--neutral-500)' : 'var(--text)'
  return (
    <div className="cbar">
      <i className="cbar__seg" style={{ left: pc(4), width: pc(back), background: c }} />
      <i className="cbar__seg" style={{ left: pc(4 + back), width: pc(down), background: c }} />
      {[0, back, back + down].map((x, i) => <i key={i} className="cbar__dot" style={{ left: pc(x), background: c }} />)}
      {labels.map(([t, x]) => <span key={t} className="t-number-s cbar__time" style={{ left: pc(x), color: dim ? 'var(--text-2-card)' : 'var(--text)' }}>{t}</span>)}
    </div>
  )
}
export function Compare({ onBack, onNext }: Pick<Nav, 'onBack' | 'onNext'>) {
  return (
    <Shell>
      <div className="body__main" style={{ gap: 24 }}>
        <div className="stack16">
          <TopBar trailing="none" step={3} onBack={onBack} />
          <Header title="Compare with the pros" text="See where this swing loses time against Tiger’s" />
        </div>
        <div className="compare">
          <div className="compare__blocks">
            <div className="stack16">
              <div className="ratio" style={{ color: 'var(--text-2-card)' }}>
                <span className="t-footnote">Tiger</span><span className="t-number-xl">3.7:1</span>
              </div>
              <Bar dim back={235.587} down={63.206} labels={[['0.82 s', 99], ['0.22 s', 249]]} />
            </div>
            <div className="stack16">
              <div className="ratio">
                <span className="t-footnote" style={{ color: 'var(--text-2-card)' }}>This swing</span><span className="t-number-xl">3.2:1</span>
              </div>
              <Bar back={275.81} down={86.19} labels={[['+0.14 s', 116], ['+0.08 s', 295]]} />
            </div>
          </div>
          <p className="t-body">Both halves are slower, mostly the downswing</p>
        </div>
      </div>
      <div className="actions"><Button onClick={onNext}>Continue</Button></div>
    </Shell>
  )
}

/* 14 / 15 Paywall */
type Plan = 'yearly' | 'monthly'
const PLAN = {
  yearly: { sub: '14 days free, then $59.99 a year', day14: 'Your yearly plan starts, unless you cancel before' },
  monthly: { sub: '14 days free, then $6.99 a month', day14: 'Your monthly plan starts, unless you cancel before' },
}
export function Paywall({ onClose, onNext }: { onClose: () => void; onNext: () => void }) {
  const [plan, setPlan] = useState<Plan>('yearly')
  return (
    <Shell>
      <div className="body__main" style={{ gap: 24 }}>
        <div className="stack16">
          <TopBar trailing="close" onTrailing={onClose} />
          <Header title="How your trial works" text={PLAN[plan].sub} />
        </div>
        <Segmented value={plan} onChange={setPlan} options={[
          { value: 'yearly', label: 'Yearly', detail: 'save 28%' },
          { value: 'monthly', label: 'Monthly', detail: '$6.99' },
        ]} />
        <div className="timeline">
          <Moment title="Today" text="Full access to all 16 tour tempos, swing timing and pro comparison" first />
          <Segment />
          <Moment title="Day 12" text="We remind you that the trial ends in 2 days" />
          <Segment height={24} />
          <Moment title="Day 14" text={PLAN[plan].day14} last />
        </div>
      </div>
      <div className="actions" style={{ gap: 24 }}>
        <div className="links"><Link>Restore purchases</Link></div>
        <div className="stack12">
          <p className="t-footnote cta-note">No payment today, cancel anytime in Settings</p>
          <Button onClick={onNext}>Start 14 days free</Button>
        </div>
      </div>
    </Shell>
  )
}

/* 16 Notifications */
export function Notifications({ onNext }: { onNext: () => void }) {
  return (
    <Shell bottom={40}>
      <div className="body__main notif">
        <div style={{ height: 54, flex: 'none' }} />
        <div className="notif__content">
          <span className="notif__bell"><Icon name="bell.badge.fill" /></span>
          <h1 className="t-large-title">Stay on tempo</h1>
          <p className="t-body" style={{ color: 'var(--text-2-card)' }}>Practice reminders for your weekly goal</p>
        </div>
      </div>
      <div className="actions">
        <Button variant="secondary" onClick={onNext}>Not now</Button>
        <Button onClick={onNext}>Turn on notifications</Button>
      </div>
    </Shell>
  )
}
