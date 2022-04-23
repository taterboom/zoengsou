import { memo, useCallback, useEffect, useRef } from "react"
import { selectMetaData } from "../../store/editorStore/selectors"
import useStore from "../../store/editorStore"
import { DataBase } from "../../store/editorStore/store"
import shallow from "zustand/shallow"
import { fillRectImageData } from "../../utils/imageHelper"

const RulerCanvas: React.FC = () => {
  const rulerCanvasRef = useRef<HTMLCanvasElement>(null)
  const metaData = useStore(selectMetaData)

  const drawRuler = useCallback(
    (canvasEl: HTMLCanvasElement | null) => {
      if (!canvasEl) {
        console.warn("no canvas element")
        return
      }
      const ctx = canvasEl.getContext("2d")
      if (!ctx) {
        console.warn("canvasEl.getContext('2d') failed")
        return
      }

      setTimeout(() => {
        console.log("-ddddd")
        const scaleSize = (num: number) => num * metaData.scale
        // 清除画布
        ctx.clearRect(0, 0, scaleSize(metaData.size.width), scaleSize(metaData.size.width))
        if (metaData.ruler.color === null || !metaData.ruler.visible) {
          return
        }
        // 画分隔线
        ctx.strokeStyle = metaData.ruler.color
        ctx.lineWidth = 2
        for (let yPoint = 1; yPoint < metaData.size.height; yPoint++) {
          ctx.moveTo(0, scaleSize(yPoint))
          ctx.lineTo(scaleSize(metaData.size.width), scaleSize(yPoint))
        }
        for (let xPoint = 1; xPoint < metaData.size.width; xPoint++) {
          ctx.moveTo(scaleSize(xPoint), 0)
          ctx.lineTo(scaleSize(xPoint), scaleSize(metaData.size.height))
        }
        ctx.stroke()
      })
    },
    [metaData]
  )

  // draw ruler
  useEffect(() => {
    drawRuler(rulerCanvasRef.current)
  }, [drawRuler])

  return (
    <canvas
      id="ruler"
      className="pointer-events-none bg-transparent absolute top-0 left-0"
      ref={rulerCanvasRef}
      width={metaData.size.width * metaData.scale}
      height={metaData.size.height * metaData.scale}
      style={{
        width: metaData.size.width * metaData.scale * metaData.ratio,
        height: metaData.size.height * metaData.scale * metaData.ratio,
      }}
    ></canvas>
  )
}

const MainCanvas: React.FC = () => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null)
  const metaData = useStore(selectMetaData)
  const updateActiveGridIndexRef = useRef(useStore((store) => store.updateActiveGridIndex))
  const updatePressingRef = useRef(useStore((store) => store.updatePressing))

  const draw = useCallback(
    (
      canvasEl: HTMLCanvasElement | null,
      store: Pick<DataBase, "surfaceStore" | "frameStore" | "activeSurfaceId">
    ) => {
      console.log("-d")
      if (!canvasEl) {
        console.warn("no canvas element")
        return
      }
      const ctx = canvasEl.getContext("2d")
      if (!ctx) {
        console.warn("canvasEl.getContext('2d') failed")
        return
      }

      const scaleSize = (num: number) => num * metaData.scale

      const canvasWidth = scaleSize(metaData.size.width)
      const canvasHeight = scaleSize(metaData.size.height)
      const unitSize = scaleSize(1)

      // 清除画布
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      const activeSurface = store.surfaceStore[store.activeSurfaceId]
      const activeFrame = store.frameStore[activeSurface.frameId]

      // 画每个Surface
      const imageData = new ImageData(canvasWidth, canvasHeight)
      for (let index = activeFrame.surfacesOrder.length - 1; index >= 0; index--) {
        const surfaceId = activeFrame.surfacesOrder[index]
        const surface = store.surfaceStore[surfaceId]
        for (let yPoint = 0; yPoint < metaData.size.height; yPoint++) {
          for (let xPoint = 0; xPoint < metaData.size.width; xPoint++) {
            const color = surface.grids[yPoint * metaData.size.width + xPoint]
            if (color) {
              fillRectImageData(
                imageData.data,
                color,
                scaleSize(xPoint),
                scaleSize(yPoint),
                canvasWidth,
                unitSize
              )
            }
          }
        }
      }
      ctx.putImageData(imageData, 0, 0)
    },
    [metaData]
  )

  // draw frames
  useEffect(() => {
    const unsubscribeDraw = useStore.subscribe(
      (state) => ({
        surfaceStore: state.surfaceStore,
        frameStore: state.frameStore,
        activeSurfaceId: state.activeSurfaceId,
      }),
      (state) => {
        draw(mainCanvasRef.current, state)
      },
      {
        fireImmediately: true,
        equalityFn: shallow,
      }
    )

    return () => {
      unsubscribeDraw()
    }
  }, [draw])

  // cursor event
  useEffect(() => {
    const canvasEl = mainCanvasRef.current

    let prevX: number
    let prevY: number

    const cursorMove = (offsetX: number, offsetY: number) => {
      const state = useStore.getState()
      const x = state.metaData.scale * state.metaData.ratio
      const xPoint = Math.floor(offsetX / x)
      const yPoint = Math.floor(offsetY / x)
      if (xPoint === prevX && yPoint === prevY) {
        return
      }
      prevX = xPoint
      prevY = yPoint
      updateActiveGridIndexRef.current(xPoint, yPoint)
    }

    const mouseMoveHandler = (e: MouseEvent) => {
      cursorMove(e.offsetX, e.offsetY)
    }

    const mouseDownHandler = (e: MouseEvent) => {
      updatePressingRef.current(true)
      cursorMove(e.offsetX, e.offsetY)
    }

    const mouseUpHandler = (e: MouseEvent) => {
      updatePressingRef.current(false)
    }

    canvasEl?.addEventListener("mousedown", mouseDownHandler)
    canvasEl?.addEventListener("mousemove", mouseMoveHandler)
    document.addEventListener("mouseup", mouseUpHandler)

    return () => {
      canvasEl?.removeEventListener("mousedown", mouseDownHandler)
      canvasEl?.removeEventListener("mousemove", mouseDownHandler)
      document.removeEventListener("mouseup", mouseDownHandler)
    }
  }, [])

  console.log("Editor render")

  return (
    <canvas
      id="main"
      className="bg-[#eee]"
      ref={mainCanvasRef}
      width={metaData.size.width * metaData.scale}
      height={metaData.size.height * metaData.scale}
      style={{
        width: metaData.size.width * metaData.scale * metaData.ratio,
        height: metaData.size.height * metaData.scale * metaData.ratio,
      }}
    ></canvas>
  )
}

const MainCanvasMemo = memo(MainCanvas)
const RulerCanvasMemo = memo(RulerCanvas)

const Canvas: React.FC = () => {
  const position = useStore((state) => state.position)
  return (
    <div id="stage-container" className="flex justify-center items-center w-screen h-screen">
      <div id="stage" className="relative" style={{ top: position.y, left: position.x }}>
        <MainCanvasMemo></MainCanvasMemo>
        <RulerCanvasMemo></RulerCanvasMemo>
      </div>
    </div>
  )
}

export default Canvas
