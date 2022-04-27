import { useEffect, useRef } from "react"
import useKeyBindingsStore from "../store/keyBindings/store"
import useStore from "../store/editorStore/store"

const BaseKeyBindings = () => {
  const addBinding = useRef(useKeyBindingsStore((state) => state.addBinding))
  useEffect(() => {
    addBinding.current("$mod+Z", "撤销", (e) => {
      console.log("??")
      e.preventDefault()
      useStore.getState().undo?.()
    })
    addBinding.current("$mod+Shift+Z", "重做", (e) => {
      console.log("??")
      e.preventDefault()
      useStore.getState().redo?.()
    })
  }, [])
  return null
}

export default BaseKeyBindings
