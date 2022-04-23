import { useEffect, useRef } from "react"

const PRE_KEYS = ["ctrlKey", "metaKey"]
export enum ZoomAction {
  reset,
  in,
  out,
}
const ZOOM_CODE = {
  Equal: {
    action: ZoomAction.in,
  },
  Minus: {
    action: ZoomAction.out,
  },
  Digit0: {
    action: ZoomAction.reset,
  },
}

const checkPreconditions = <T extends Event>(e: T) => {
  // @ts-ignore
  return PRE_KEYS.some((key) => e[key])
}

type CreateZoomBlockerOptions = {
  onZoom?: (action: ZoomAction) => void
}

export const createZoomBlocker = (options: CreateZoomBlockerOptions = {}) => {
  const { onZoom } = options
  if (document) {
    // TODO 操作面板上下机器快捷键
    window.addEventListener(
      "wheel",
      function (e) {
        console.log("wheel", e)
        e.preventDefault()
        // TODO 滚轮与触摸板的放大缩小
      },
      { passive: false }
    )
    // TODO 快捷键系统
    document.addEventListener("keydown", function (e) {
      console.log(e.code)
      if (checkPreconditions(e) && e.code in ZOOM_CODE) {
        e.preventDefault()
        if (onZoom) {
          onZoom(ZOOM_CODE[e.code as keyof typeof ZOOM_CODE].action)
        }
      }
    })
  }
}

const useBlockWheel = (cb?: (e: WheelEvent) => any) => {
  const cbRef = useRef(cb)
  cbRef.current = cb
  useEffect(() => {
    if (document) {
      window.addEventListener(
        "wheel",
        function (e) {
          e.preventDefault()
          cbRef.current?.(e)
        },
        { passive: false }
      )
    }
  }, [])
}

export default useBlockWheel
