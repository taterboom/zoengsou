import React, { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const Portal: React.FC = (props) => {
  const container = useRef<HTMLElement>()

  useEffect(() => {
    return () => {
      const element = container.current!
      element.parentElement?.removeChild(element)
    }
  }, [])

  if (!container.current) {
    const div = document.createElement("div")
    document.body.appendChild(div)
    container.current = div
  }
  return createPortal(props.children, container.current)
}

export default Portal
