import { useEffect, useMemo, useRef, useState } from "react"
import { CSSTransition } from "react-transition-group"
import useStore from "../../store/editorStore"
import { imageContain, createImageFromFile, getGridsFromImageData } from "../../utils/imageHelper"
import Popup from "../UI/Popup"

type UseImageDropOptions = {
  cb?: (f: File) => void
}

const useImageDrop = ({ cb }: UseImageDropOptions) => {
  const [dragging, setDragging] = useState(false)
  const cbRef = useRef(cb)
  cbRef.current = cb
  useEffect(() => {
    const onDragEnter = () => {
      setDragging(true)
    }
    const onDragLeave = () => {
      setDragging(false)
    }
    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
    }
    const onDrop = (e: DragEvent): void => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer?.files?.[0]?.type.startsWith("image")) {
        cbRef.current?.(e.dataTransfer.files[0])
      }
    }
    document.addEventListener("dragenter", onDragEnter)
    document.addEventListener("dragover", onDragOver)
    document.addEventListener("dragleave", onDragLeave)
    document.addEventListener("drop", onDrop)

    return () => {
      document.removeEventListener("dragenter", onDragEnter)
      document.removeEventListener("dragover", onDragOver)
      document.removeEventListener("dragleave", onDragLeave)
      document.removeEventListener("drop", onDrop)
    }
  }, [])

  return useMemo(() => [dragging], [dragging])
}

const DNDImporter: React.FC = () => {
  const metaData = useStore((state) => state.metaData)
  const updateActiveSurface = useStore((state) => state.updateActiveSurface)

  const importFile = async (file: File) => {
    // 使用同规格的canvas画图，再导出结构
    // 图片在一定范围内居中显示（类似contain）
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = metaData.size.width * metaData.scale
    tempCanvas.height = metaData.size.height * metaData.scale
    const ctx = tempCanvas.getContext("2d")
    const img = await createImageFromFile(file)
    if (ctx) {
      const [x, y, width, height] = imageContain(
        img.naturalWidth,
        img.naturalHeight,
        tempCanvas.width,
        tempCanvas.height
      )
      ctx.drawImage(img, x, y, width, height)
    }
    const imageData = ctx?.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
    const data = imageData?.data
    if (!data) return
    const grids = getGridsFromImageData(
      data,
      metaData.size.width,
      metaData.size.height,
      metaData.scale
    )
    return grids
  }

  const [dragging] = useImageDrop({
    cb: (f) => {
      importFile(f).then((grids) => updateActiveSurface({ grids }))
    },
  })

  return (
    <Popup className="pointer-events-none" show={dragging}>
      <div>importer</div>
    </Popup>
  )
}

export default DNDImporter
