import { useMemo, useState } from 'react'
import { Button, Chip, Icon, Link, PullDown, Segmented, Sheet, SwingCard, TabBar, Tag, TopBar, WeekTrack } from '../components'
import type { DayState } from '../components'
import { tone, unlockAudio } from '../audio'
import statusBar from '../assets/reference/status-bar.svg'

const CLUBS = ['Driver', 'Fairway Wood', 'Iron', 'Pitch', 'Putt'] as const
type Club = (typeof CLUBS)[number]

// Driver comes from Figma; the other clubs use made-up numbers in the same shape
const TEMPO: Record<Club, { value: number; zone: [number, number]; good: number[]; other: number[] }> = {
  Driver: { value: 3.2, zone: [3.1, 3.3], good: [3.1, 3.2, 3.2, 3.3], other: [2.8, 3.6] },
  'Fairway Wood': { value: 3.0, zone: [2.9, 3.1], good: [2.9, 3.0, 3.1], other: [2.6, 3.5] },
  Iron: { value: 2.8, zone: [2.7, 2.9], good: [2.7, 2.8, 2.8, 2.9, 2.9], other: [3.3, 3.7] },
  Pitch: { value: 3.6, zone: [3.5, 3.7], good: [3.5, 3.6, 3.7], other: [3.0, 2.8] },
  Putt: { value: 3.8, zone: [3.7, 3.9], good: [3.7, 3.8, 3.9], other: [3.2, 3.4] },
}
const x = (v: number) => 4 + ((v - 2.5) / 1.5) * 322

const SWINGS: { ratio: string; club: Club; day: string; star: boolean }[] = [
  { ratio: '3.3:1', club: 'Driver', day: 'Today', star: true },
  { ratio: '2.8:1', club: 'Iron', day: 'Today', star: false },
  { ratio: '3.2:1', club: 'Driver', day: 'Mon', star: true },
  { ratio: '3.6:1', club: 'Pitch', day: 'Mon', star: false },
  { ratio: '3.0:1', club: 'Fairway Wood', day: 'Sun', star: false },
  { ratio: '3.8:1', club: 'Putt', day: 'Sat', star: false },
]

const DAYS: { letter: string; state: DayState }[] = [
  { letter: 'M', state: 'done' }, { letter: 'T', state: 'pending' }, { letter: 'W', state: 'today' },
  { letter: 'T', state: 'pending' }, { letter: 'F', state: 'pending' }, { letter: 'S', state: 'pending' }, { letter: 'S', state: 'pending' },
]

function Scale({ club }: { club: Club }) {
  const d = TEMPO[club]
  return (
    <div className="scale">
      <i className="scale__zone" style={{ left: x(d.zone[0]), width: ((d.zone[1] - d.zone[0]) / 1.5) * 322 }} />
      <i className="scale__track" />
      {d.other.map((v, i) => <i key={`o${i}`} className="scale__dot" style={{ left: x(v) - 4 }} />)}
      {d.good.map((v, i) => <i key={`g${i}`} className="scale__dot is-good" style={{ left: x(v) - 4 }} />)}
      <span className="t-footnote scale__min">2.5</span>
      <span className="t-footnote scale__max">4.0</span>
    </div>
  )
}

type SheetId = 'tips' | 'add' | null
const TIPS = [
  ['Film from the side', 'Face-on or down the line, with your whole body and the club in frame'],
  ['Keep the phone still', 'Lean it on your bag or use a tripod'],
  ['Start before you set up', 'Record a moment before the takeaway and stop after the finish'],
  ['Use slow motion if you can', 'More frames mean more precise marks'],
]

export function MySwings() {
  const [tempoClub, setTempoClub] = useState<Club>('Driver')
  const [filter, setFilter] = useState<'star' | 'all' | Club>('all')
  const [sort, setSort] = useState<'Newest' | 'Oldest'>('Newest')
  const [sheet, setSheet] = useState<SheetId>(null)
  const [tipsSeen, setTipsSeen] = useState(false)
  const [mode, setMode] = useState<'swing' | 'routine'>('swing')

  const t = TEMPO[tempoClub]
  const list = useMemo(() => {
    let l = SWINGS.filter(s => filter === 'all' || (filter === 'star' ? s.star : s.club === filter))
    if (sort === 'Oldest') l = [...l].reverse()
    return l
  }, [filter, sort])

  const playTempo = () => {
    unlockAudio()
    tone(0)
    window.setTimeout(() => tone(1), 800)
    window.setTimeout(() => tone(2), 800 + 800 / t.value)
  }
  const openAdd = () => {
    if (!tipsSeen) { setTipsSeen(true); setSheet('tips') } else setSheet('add')
  }
  const routine = mode === 'routine'

  return (
    <div className="shell">
      <img className="statusbar" src={statusBar} alt="" width={402} height={62} draggable={false} />
      <div className="scroll">
        <TopBar trailing="title" title="My Swings" />
        <div className="swings-content">
          <section className="stack12">
            <div className="row-between">
              <div className="row-gap8"><h2 className="t-headline">This week</h2><Tag>3-week streak</Tag></div>
              <span className="t-footnote" style={{ color: 'var(--text-2)' }}>2 of 2 days</span>
            </div>
            <WeekTrack days={DAYS} />
          </section>

          <section className="tempo-card">
            <div className="row-between">
              <h2 className="t-headline">Your tempo</h2>
              <PullDown options={[...CLUBS]} value={tempoClub} onChange={setTempoClub} />
            </div>
            <div className="t-number-xl">{t.value.toFixed(1)}:1</div>
            <Scale club={tempoClub} />
            <p className="t-body" style={{ color: 'var(--text-2-card)' }}>
              Zone {t.zone[0].toFixed(1)}–{t.zone[1].toFixed(1)} from {t.good.length} good shots
            </p>
            <Button variant="secondary" onClick={playTempo}>Play my tempo</Button>
          </section>

          <section className="stack16">
            <div className="row-between">
              <h2 className="t-headline">Swings</h2>
              <PullDown options={['Newest', 'Oldest']} value={sort} onChange={setSort} />
            </div>
            <div className="chips">
              <Chip selected={filter === 'star'} onClick={() => setFilter('star')}><Icon name="star.fill" height={13} /></Chip>
              <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
              {CLUBS.map(c => <Chip key={c} selected={filter === c} onClick={() => setFilter(c)}>{c}</Chip>)}
            </div>
            <div className="grid">
              {list.map(s => <SwingCard key={s.ratio + s.day} ratio={s.ratio} club={s.club} day={s.day} starred={s.star} />)}
            </div>
          </section>
        </div>
      </div>

      <TabBar onChange={() => {}} onAdd={openAdd} />

      <Sheet open={sheet === 'tips'} onClose={() => setSheet(null)}>
        <h2 className="t-headline">How to film your swing</h2>
        <div className="tips t-headline">
          {TIPS.map(([title, text], i) => (
            <div key={title} className="tip">
              <span className="tip__n">{i + 1}</span>
              <div className="tip__text"><span>{title}</span><span className="tip__sub">{text}</span></div>
            </div>
          ))}
        </div>
        <div className="sheet__actions"><Button onClick={() => setSheet('add')}>Got it</Button></div>
      </Sheet>

      <Sheet open={sheet === 'add'} onClose={() => setSheet(null)}>
        <Segmented value={mode} onChange={setMode} options={[
          { value: 'swing', label: 'Swing' },
          { value: 'routine', label: 'Routine' },
        ]} />
        <div className="stack8">
          <h2 className="t-title-2">{routine ? 'Time a routine' : 'Time a swing'}</h2>
          <Link onClick={() => setSheet('tips')}>{routine ? 'How to film your routine' : 'How to film your swing'}</Link>
        </div>
        <div className="sheet__actions">
          <Button variant="secondary"><span className="btn__row"><Icon name="video" />{routine ? 'Film a routine' : 'Film a new swing'}</span></Button>
          <Button><span className="btn__row"><Icon name="arrow.down.to.line" />Import a video</span></Button>
        </div>
      </Sheet>
    </div>
  )
}
