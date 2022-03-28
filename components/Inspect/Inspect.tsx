import { useState } from "react"
import { selectActiveSurface, selectMetaData } from "../../store/editorStore/selectors"
import { Tab, Tabs } from "../Tabs"
import useStore from "../../store/editorStore/store"
import NumberInput from "../NumberInput"

const CanvasInspect: React.FC = () => {
  const metaData = useStore(selectMetaData)
  const updateMetaData = useStore((state) => state.updateMetaData)
  return (
    <div>
      <div>
        width:
        <NumberInput
          value={metaData.size.width}
          onChange={(v) => updateMetaData({ size: { width: v, height: metaData.size.height } })}
        ></NumberInput>{" "}
      </div>
      <div>
        height:
        <NumberInput
          value={metaData.size.width}
          onChange={(v) => updateMetaData({ size: { width: metaData.size.width, height: v } })}
        ></NumberInput>
      </div>
      <div>
        scale:
        <NumberInput
          value={metaData.scale}
          onChange={(v) => updateMetaData({ scale: v })}
        ></NumberInput>
      </div>
    </div>
  )
}

const LayerInspect: React.FC = () => {
  const activeSurface = useStore(selectActiveSurface)
  const activeLayer = useStore((state) => state.layerStore[activeSurface.layerId])
  return (
    <div>
      <div>name: {activeLayer.name}</div>
    </div>
  )
}

const Inspect: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  return (
    <div className="fixed top-20 right-0 w-[240px] h-[360px] bg-white">
      <Tabs value={activeTabIndex} onChange={setActiveTabIndex}>
        <Tab>Canvas</Tab>
        <Tab>Layer</Tab>
      </Tabs>
      <div>
        {activeTabIndex === 0 && <CanvasInspect></CanvasInspect>}
        {activeTabIndex === 1 && <LayerInspect></LayerInspect>}
      </div>
    </div>
  )
}

export default Inspect
