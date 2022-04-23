import { MutableRefObject, useEffect, useRef } from "react"

const useClickAway = <T extends HTMLElement>(
  cb: () => void,
  target: MutableRefObject<T | null>
) => {
  const cbRef = useRef(cb)
  cbRef.current = cb
  useEffect(() => {
    const handler = (e: any) => {
      if (!target.current?.contains(e.target)) {
        cbRef.current()
      }
    }
    document.addEventListener("click", handler)
    return () => {
      document.removeEventListener("click", handler)
    }
  }, [target])
}

export default useClickAway
