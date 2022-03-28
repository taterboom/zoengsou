import useStore from "../../store/editorStore/store"
import Button from "../Button"
import classnames from "classnames"
import { selectActiveSurface } from "../../store/editorStore/selectors"

const Header: React.FC = () => {
  const framesOrder = useStore((state) => state.framesOrder)
  const activeSurface = useStore(selectActiveSurface)
  return (
    <header className="flex">
      <div className="w-[200px]">control</div>
      <div>
        {framesOrder.map((id) => (
          <div key={id} className={classnames({ border: activeSurface.frameId === id })}>
            {id}
          </div>
        ))}
      </div>
    </header>
  )
}

const Layers: React.FC = () => {
  const layersOrder = useStore((state) => state.layersOrder)
  const activeSurface = useStore(selectActiveSurface)
  const addLayer = useStore((state) => state.addLayer)
  return (
    <aside className="w-[200px]">
      {layersOrder.map((id) => (
        <div key={id} className={classnames({ border: activeSurface.layerId === id })}>
          {id}
        </div>
      ))}
      <Button
        onClick={() => {
          addLayer()
        }}
      >
        +
      </Button>
    </aside>
  )
}

const Surfaces: React.FC = () => {
  const layersOrder = useStore((state) => state.layersOrder)
  const layerStore = useStore((state) => state.layerStore)
  const activeSurface = useStore(selectActiveSurface)
  const updateActiveSurfaceId = useStore((state) => state.updateActiveSurfaceId)
  return (
    <main>
      {layersOrder.map((id) => (
        <div key={id} className="flex">
          {layerStore[id].surfacesOrder.map((surfaceId) => (
            <div
              key={surfaceId}
              className={classnames({ border: activeSurface.id === surfaceId })}
              onClick={() => {
                updateActiveSurfaceId(surfaceId)
              }}
            >
              {surfaceId}
            </div>
          ))}
        </div>
      ))}
    </main>
  )
}

const Body: React.FC = () => {
  return (
    <div className="flex">
      <Layers></Layers>
      <Surfaces></Surfaces>
    </div>
  )
}

const ControllerBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-white">
      <Header></Header>
      <Body></Body>
    </div>
  )
}

export default ControllerBar
