import { useEffect } from "react"
import keybindings from "tinykeys"
import useKeyBindingsStore from "../store/keyBindings/store"

const KeyBindings = () => {
  const bindings = useKeyBindingsStore((state) => state.bindings)
  useEffect(() => {
    return keybindings(
      window,
      Object.entries(bindings).reduce<{ [x: string]: (e: any) => any }>((total, [key, value]) => {
        total[key] = value.cb
        return total
      }, {})
    )
  }, [bindings])
  return null
}

export default KeyBindings
