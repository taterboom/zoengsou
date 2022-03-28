import ControllerBar from "../components/ControllerBar"
import Canvas from "../components/Editor/Canvas"
import Map from "../components/Map"
import MenuBar from "../components/MenuBar"
import MetaData from "../components/MetaData"
import Palette from "../components/Palette"
import ToolBar from "../components/ToolBar"
import useBlockZoom, { ZoomAction } from "../hooks/useBlockZoom"
import Inspect from "./Inspect"

const App: React.FC = () => {
  useBlockZoom({
    onZoom: (action) => {
      //  switch (action) {
      //    case ZoomAction.
      //  }
    },
  })

  return (
    <div>
      <Canvas></Canvas>
      {/* <MenuBar></MenuBar> */}
      <ToolBar></ToolBar>
      <ControllerBar></ControllerBar>
      <Inspect></Inspect>
      {/* <MetaData></MetaData> */}
      {/* <Palette></Palette> */}
      {/* <Map></Map> */}
    </div>
  )
}

export default App
