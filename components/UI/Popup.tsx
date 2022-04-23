import { CSSTransition } from "react-transition-group"
import Portal from "./Portal"

type PopupProps = {
  show: boolean
  className?: string
  onClose?: () => void
}

const Popup: React.FC<PopupProps> = ({ children, className = "", show, onClose }) => {
  return (
    <Portal>
      <CSSTransition in={show} timeout={200} classNames="fade" unmountOnExit>
        <div
          className={
            "fixed w-screen h-screen inset-0 bg-slate-900/30 flex justify-center items-center " +
            className
          }
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose?.()
            }
          }}
        >
          {children}
        </div>
      </CSSTransition>
    </Portal>
  )
}

export default Popup
