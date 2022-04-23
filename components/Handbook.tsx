import { useState } from "react"
import { parseKeybinding } from "tinykeys"
import useKeyBindingsStore from "../store/keyBindings/store"
import Button from "./UI/Button"
import Popup from "./UI/Popup"

let MOD =
  typeof navigator === "object" && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    ? "Meta"
    : "Control"

const HandBook = () => {
  const [show, setShow] = useState(false)
  const bindings = useKeyBindingsStore((state) => state.bindings)
  return (
    <>
      <Button onClick={() => setShow(true)}>HandBook</Button>
      <Popup show={show} onClose={() => setShow(false)}>
        <div>
          <h2>Keyboard Shorcut</h2>
          <ul>
            {Object.entries(bindings).map(([key, value]) => (
              <li key={key}>
                {value.desc} {key.replaceAll("$mod", MOD)}
              </li>
            ))}
          </ul>
        </div>
      </Popup>
    </>
  )
}

export default HandBook
