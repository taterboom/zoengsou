import ControllerBar from "../components/ControllerBar"
import Canvas from "../components/Editor/Canvas"
import Map from "../components/Map"
import MenuBar from "../components/MenuBar"
import ToolBar from "../components/ToolBar"
import useBlockZoom, { ZoomAction } from "../hooks/useBlockWheel"
import DNDImporter from "./Importer/DNDImporter"
import Inspect from "./Inspect"
import KeyBindings from "./KeyBindings"
import ScaleKeyBindings from "./ScaleKeyBindings"
import { useState } from "react"

const App: React.FC = () => {
  const [isSimpleMode, setIsSimpleMode] = useState(false)

  useBlockZoom((e) => {
    if (e.deltaY < 0) {
      setIsSimpleMode(false)
    } else if (e.deltaY > 0) {
      setIsSimpleMode(true)
    }
  })

  console.log(isSimpleMode)

  return (
    <div>
      <Canvas></Canvas>
      <KeyBindings></KeyBindings>
      <ScaleKeyBindings></ScaleKeyBindings>
      <MenuBar active={!isSimpleMode}></MenuBar>
      <ToolBar active={!isSimpleMode}></ToolBar>
      <ControllerBar active={!isSimpleMode}></ControllerBar>
      <Inspect active={!isSimpleMode}></Inspect>
      <DNDImporter></DNDImporter>
      {/* <Map></Map> */}
    </div>
  )
}

export default App
