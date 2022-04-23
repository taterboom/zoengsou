import useStore from "../../store/editorStore/store"
import Button from "../UI/Button"
import classnames from "classnames"
import { selectActiveSurface } from "../../store/editorStore/selectors"
import EditorComponentWrapper from "../EditorComponentWrapper"

const Header: React.FC = () => {
  const framesOrder = useStore((state) => state.framesOrder)
  const activeSurface = useStore(selectActiveSurface)
  const addLayer = useStore((state) => state.addLayer)
  const addFrame = useStore((state) => state.addFrame)
  return (
    <header className="flex">
      <div className="w-[200px]">
        <Button
          onClick={() => {
            addLayer()
          }}
        >
          +
        </Button>
      </div>
      <div className="flex">
        {framesOrder.map((id) => (
          <div key={id} className={classnames({ border: activeSurface.frameId === id })}>
            {id}
          </div>
        ))}
        <Button
          onClick={() => {
            addFrame()
          }}
        >
          +
        </Button>
      </div>
    </header>
  )
}

const Layers: React.FC = () => {
  const layersOrder = useStore((state) => state.layersOrder)
  const activeSurface = useStore(selectActiveSurface)
  return (
    <aside className="w-[200px]">
      {layersOrder.map((id) => (
        <div key={id} className={classnames({ border: activeSurface.layerId === id })}>
          {id}
        </div>
      ))}
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

const ControllerBar: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <EditorComponentWrapper active={active} direction="top">
      <div className="fixed bottom-0 left-0 w-full flex justify-center">
        <div className="w-[800px] h-[200px] bg-white">
          <Header></Header>
          <Body></Body>
        </div>
      </div>
    </EditorComponentWrapper>
  )
}

export default ControllerBar
