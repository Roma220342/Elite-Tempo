import { useState } from 'react'
import { Button, Chip, GlassButton, Link, PullDown, Segmented, Sheet, SwingCard, TabBar, Tag, TopBar, WeekTrack } from './components'
import type { Tab } from './components'

const CLUBS = ['Driver', 'Fairway Wood', 'Iron', 'Pitch', 'Putt'] as const

// Component check page: open with ?gallery
export function Gallery() {
  const [club, setClub] = useState<(typeof CLUBS)[number]>('Driver')
  const [plan, setPlan] = useState<'yearly' | 'monthly'>('yearly')
  const [chip, setChip] = useState('All')
  const [, setTab] = useState<Tab>('swings')
  const [sheet, setSheet] = useState(false)

  return (
    <>
      <div className="gallery">
        <TopBar trailing="skip" step={1} />
        <TopBar trailing="close" step={1} />
        <TopBar trailing="title" title="My Swings" />
        <h2>Button</h2>
        <Button>Continue</Button>
        <Button variant="secondary">Continue</Button>
        <Button variant="disabled">Continue</Button>
        <h2>Segmented, Chip, Tag, Link, Pull-down</h2>
        <Segmented value={plan} onChange={setPlan} options={[
          { value: 'yearly', label: 'Yearly', detail: 'save 28%' },
          { value: 'monthly', label: 'Monthly', detail: '$6.99' },
        ]} />
        <div className="row">
          {['★', 'All', ...CLUBS].map(c => <Chip key={c} selected={chip === c} onClick={() => setChip(c)}>{c}</Chip>)}
        </div>
        <div className="row"><Tag>3 free</Tag><Link>Restore purchases</Link><PullDown options={[...CLUBS]} value={club} onChange={setClub} /></div>
        <h2>Week track, Swing card</h2>
        <WeekTrack days={[
          { letter: 'M', state: 'pending' }, { letter: 'T', state: 'pending' }, { letter: 'W', state: 'today' },
          { letter: 'T', state: 'pending' }, { letter: 'F', state: 'pending' }, { letter: 'S', state: 'pending' }, { letter: 'S', state: 'pending' },
        ]} />
        <div className="row"><SwingCard ratio="3.3:1" club="Driver" day="Today" starred /></div>
        <h2>Glass</h2>
        <div className="row"><GlassButton icon="chevron.left" label="Back" /><GlassButton icon="xmark" label="Close" /><GlassButton label="Skip" wide /><GlassButton icon="gearshape" label="Settings" /></div>
        <div style={{ height: 96 }} />
      </div>
      <TabBar onChange={setTab} onAdd={() => setSheet(true)} />
      <Sheet open={sheet} onClose={() => setSheet(false)}><div style={{ height: 200 }} /></Sheet>
    </>
  )
}
