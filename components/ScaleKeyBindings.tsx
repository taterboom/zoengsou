import { useEffect, useRef } from "react"
import useKeyBindingsStore from "../store/keyBindings/store"
import useStore from "../store/editorStore/store"
import { DEFAULT_SCALE } from "../store/editorStore/constants"

const ScaleKeyBindings = () => {
  const updateMetaData = useRef(useStore((state) => state.updateMetaData))
  const addBinding = useRef(useKeyBindingsStore((state) => state.addBinding))
  useEffect(() => {
    addBinding.current("$mod+=", "放大", (e) => {
      e.preventDefault()
      updateMetaData.current({ scale: useStore.getState().metaData.scale * 2 })
    })
    addBinding.current("$mod+-", "放大", (e) => {
      e.preventDefault()
      updateMetaData.current({ scale: Math.max(useStore.getState().metaData.scale / 2, 1) })
    })
    addBinding.current("$mod+0", "重置缩放", (e) => {
      e.preventDefault()
      updateMetaData.current({ scale: DEFAULT_SCALE })
    })
  }, [])
  return null
}

export default ScaleKeyBindings
