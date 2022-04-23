import Button from "../UI/Button"
import useStore, { Frame } from "../../store/editorStore/store"
import { fillRectImageData } from "../../utils/imageHelper"
import loadScript from "../../utils/loadScript"
import { download } from "../../utils/download"

const useGifExporter = () => {
  const surfaceStore = useStore((state) => state.surfaceStore)
  const frameStore = useStore((state) => state.frameStore)
  const framesOrder = useStore((state) => state.framesOrder)
  const metaData = useStore((state) => state.metaData)
  const interval = useStore((state) => state.animationConfig.interval)

  const trigger = async () => {
    await loadScript("/gif.js")
    // @ts-ignore
    const gif = new GIF({
      width: metaData.size.width,
      height: metaData.size.height,
    })

    const canvasEl = document.createElement("canvas")
    canvasEl.width = metaData.size.width
    canvasEl.height = metaData.size.height
    const ctx = canvasEl.getContext("2d")
    const imageData = ctx?.getImageData(0, 0, metaData.size.width, metaData.size.height)
    if (!imageData) return
    const drawFrame = (frame: Frame) => {
      ctx?.clearRect(0, 0, canvasEl.width, canvasEl.height)
      for (const surfaceId of frame.surfacesOrder.reverse()) {
        const surface = surfaceStore[surfaceId]
        for (let i = 0; i < metaData.size.height; i++) {
          for (let j = 0; j < metaData.size.height; j++) {
            const color = surface.grids[i * metaData.size.width + j]
            if (color) {
              fillRectImageData(imageData.data, color, j, i, metaData.size.width, 1)
            }
          }
        }
      }
      ctx?.putImageData(imageData, 0, 0)
      // or copy the pixels from a canvas context
      gif.addFrame(ctx, { copy: true, delay: interval })
    }
    for (const frameId of framesOrder) {
      const frame = frameStore[frameId]
      drawFrame(frame)
    }

    gif.on("finished", function (blob: Blob) {
      const url = URL.createObjectURL(blob)
      download(`zoengsou.gif`, url)
      URL.revokeObjectURL(url)
    })

    gif.render()
  }

  return trigger
}

const AnimationExporter: React.FC = () => {
  const trigger = useGifExporter()

  return <Button onClick={() => trigger()}>animation</Button>
}

export default AnimationExporter
