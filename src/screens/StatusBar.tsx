import dark from '../assets/reference/status-bar.svg'
import light from '../assets/reference/status-bar-light.svg'

/* Figma status bar, only drawn inside the desktop bezel */
export function StatusBar() {
  return (
    <>
      <img className="statusbar statusbar--dark" src={dark} alt="" width={402} height={62} draggable={false} />
      <img className="statusbar statusbar--light" src={light} alt="" width={402} height={62} draggable={false} />
    </>
  )
}
