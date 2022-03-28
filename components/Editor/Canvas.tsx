import { useCallback, useEffect, useRef } from "react"
import { selectMetaData } from "../../store/editorStore/selectors"
import useStore from "../../store/editorStore"
import { DataBase } from "../../store/editorStore/store"
import shallow from "zustand/shallow"

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
        if (metaData.rulerColor === null) {
          return
        }

        console.log("-ddddd")

        const scaleSize = (num: number) => num * metaData.scale

        // 清除画布
        ctx.clearRect(0, 0, scaleSize(metaData.size.width), scaleSize(metaData.size.width))

        // 画分隔线
        ctx.strokeStyle = metaData.rulerColor
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

      // 清除画布
      ctx.clearRect(0, 0, scaleSize(metaData.size.width), scaleSize(metaData.size.width))

      const activeSurface = store.surfaceStore[store.activeSurfaceId]
      const activeFrame = store.frameStore[activeSurface.frameId]

      // 画每个Surface
      for (let index = activeFrame.surfacesOrder.length - 1; index >= 0; index--) {
        const surfaceId = activeFrame.surfacesOrder[index]
        const surface = store.surfaceStore[surfaceId]
        for (let yPoint = 0; yPoint < metaData.size.height; yPoint++) {
          for (let xPoint = 0; xPoint < metaData.size.width; xPoint++) {
            const color = surface.grids[yPoint * metaData.size.width + xPoint]
            if (color) {
              ctx.fillStyle = color
              ctx.fillRect(scaleSize(xPoint), scaleSize(yPoint), scaleSize(1), scaleSize(1))
            }
          }
        }
      }
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
    canvasEl?.addEventListener("mouseup", mouseUpHandler)

    return () => {
      canvasEl?.removeEventListener("mousedown", mouseDownHandler)
      canvasEl?.removeEventListener("mousemove", mouseDownHandler)
      canvasEl?.removeEventListener("mouseup", mouseDownHandler)
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

const Canvas: React.FC = () => {
  return (
    <div className="relative">
      <MainCanvas></MainCanvas>
      <RulerCanvas></RulerCanvas>
    </div>
  )
}

export default Canvas
