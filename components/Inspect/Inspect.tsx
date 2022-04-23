import { useState } from "react"
import { Tab, Tabs } from "../UI/Tabs"
import EditorComponentWrapper from "../EditorComponentWrapper"
import CanvasInspect from "./CanvasInspect"
import LayerInspect from "./LayoutInspect"
import AnimationInspect from "./AnimationInspect"

const Inspect: React.FC<{ active: boolean }> = ({ active }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  return (
    <EditorComponentWrapper active={active} direction="left">
      <div className="fixed top-0 right-0 h-full pt-20">
        <div className="w-[240px] h-[360px] bg-white">
          <Tabs value={activeTabIndex} onChange={setActiveTabIndex}>
            <Tab>Canvas</Tab>
            <Tab>Layer</Tab>
            <Tab>Animation</Tab>
          </Tabs>
          <div>
            {activeTabIndex === 0 && <CanvasInspect></CanvasInspect>}
            {activeTabIndex === 1 && <LayerInspect></LayerInspect>}
            {activeTabIndex === 2 && <AnimationInspect></AnimationInspect>}
          </div>
        </div>
      </div>
    </EditorComponentWrapper>
  )
}

export default Inspect
