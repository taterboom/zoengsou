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
    window.addEventListener(
      "wheel",
      function (e) {
        console.log("wheel", e)
        e.preventDefault()
        // TODO 滚轮与触摸板的放大缩小
      },
      { passive: false }
    )
    document.addEventListener("keydown", function (e) {
      if (checkPreconditions(e) && e.code in ZOOM_CODE) {
        e.preventDefault()
        if (onZoom) {
          onZoom(ZOOM_CODE[e.code as keyof typeof ZOOM_CODE].action)
        }
      }
    })
  }
}

const useBlockZoom = (options?: CreateZoomBlockerOptions) => {
  const isMounted = useRef(false)
  useEffect(() => {
    if (!isMounted.current) {
      createZoomBlocker(options)
    }
    isMounted.current = true
  }, [options])
}

export default useBlockZoom
