import { selectActiveSurface } from "../../store/editorStore/selectors"
import useStore from "../../store/editorStore/store"

const LayerInspect: React.FC = () => {
  const activeSurface = useStore(selectActiveSurface)
  const activeLayer = useStore((state) => state.layerStore[activeSurface.layerId])
  return (
    <div>
      <div>name: {activeLayer.name}</div>
    </div>
  )
}

export default LayerInspect
