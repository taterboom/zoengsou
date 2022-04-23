import { CSSTransition } from "react-transition-group"

const EditorComponentWrapper: React.FC<{
  active: boolean
  direction?: "top" | "bottom" | "left" | "right"
}> = ({ children, active, direction = "top" }) => {
  return (
    <CSSTransition in={active} timeout={200} classNames={`slide-${direction}`}>
      {children}
    </CSSTransition>
  )
}

export default EditorComponentWrapper
