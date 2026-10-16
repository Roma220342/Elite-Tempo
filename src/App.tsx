import { useEffect, useState } from 'react'
import { unlockAudio } from './audio'
import { Compare, Hear, MarkIntro, Notifications, Paywall, Splash } from './screens/Onboarding'
import { Mark } from './screens/Mark'
import { Player } from './screens/Player'
import { MySwings } from './screens/MySwings'
import type { SwingsState } from './screens/MySwings'
import { Gallery } from './Gallery'
import { ProtoControls } from './ProtoControls'
import bezel from './assets/reference/bezel.png'

type Screen = 'splash' | 'limit' | 'hear' | 'player' | 'markIntro' | 'mark' | 'compare' | 'paywall' | 'notifications' | 'swings'

export default function App() {
  const [screen, setScreen] = useState<Screen>((new URLSearchParams(location.search).get('screen') as Screen) || 'splash')
  const [swState, setSwState] = useState<SwingsState>((Number(new URLSearchParams(location.search).get('state')) as SwingsState) || 22)
  const gallery = new URLSearchParams(location.search).has('gallery')

  useEffect(() => {
    const h = () => unlockAudio()
    window.addEventListener('pointerdown', h)
    return () => window.removeEventListener('pointerdown', h)
  }, [])

  const go = (s: Screen) => () => setScreen(s)

  let view
  if (gallery) view = <Gallery />
  else switch (screen) {
    case 'splash': view = <Splash onNext={go('hear')} />; break
    case 'hear': view = <Hear onBack={() => {}} onSkip={go('markIntro')} onNext={go('player')} />; break
    case 'player': view = <Player onBack={go('hear')} onSkip={go('markIntro')} onNext={go('markIntro')} />; break
    case 'markIntro': view = <MarkIntro onBack={go('player')} onSkip={go('compare')} onNext={go('mark')} />; break
    case 'mark': view = <Mark onBack={go('markIntro')} onSkip={go('compare')} onNext={go('compare')} />; break
    case 'compare': view = <Compare onBack={go('mark')} onNext={go('paywall')} />; break
    case 'paywall': view = <Paywall onClose={go('notifications')} onNext={go('notifications')} />; break
    case 'notifications': view = <Notifications onNext={go('swings')} />; break
    case 'swings': view = <MySwings key={swState} state={swState} onLimit={go('limit')} />; break
    case 'limit': view = <Paywall limit onClose={go('swings')} onNext={() => { setSwState(22); setScreen('swings') }} />; break
  }

  return (
    <div className="stage">
      <div className="device">
        <div className="device__screen"><div className="screen">{view}</div></div>
        <img className="device__bezel" src={bezel} alt="" draggable={false} />
      </div>
      <ProtoControls onRestart={() => setScreen('splash')} />
    </div>
  )
}
