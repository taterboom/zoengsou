import { selectActiveSurface } from "../../store/editorStore/selectors"
import useStore from "../../store/editorStore/store"
import { download } from "../../utils/download"
import { fillRectImageData } from "../../utils/imageHelper"
import Button from "../UI/Button"

const useImgExporter = (type: string) => {
  const activeSurface = useStore(selectActiveSurface)
  const metaData = useStore((state) => state.metaData)

  const trigger = () => {
    const canvasEl = document.createElement("canvas")
    canvasEl.width = metaData.size.width
    canvasEl.height = metaData.size.height
    const ctx = canvasEl.getContext("2d")
    const imageData = ctx?.getImageData(0, 0, metaData.size.width, metaData.size.height)
    if (!imageData) return
    for (let i = 0; i < metaData.size.height; i++) {
      for (let j = 0; j < metaData.size.height; j++) {
        const color = activeSurface.grids[i * metaData.size.width + j]
        if (color) {
          fillRectImageData(imageData.data, color, j, i, metaData.size.width, 1)
        }
      }
    }
    ctx?.putImageData(imageData, 0, 0)

    const dataURL = canvasEl.toDataURL(type)
    download(`zoengsou.${type}`, dataURL)
  }

  return trigger
}

type ImgExporterProps = {
  type?: "png" | "svg" | "jpg"
}
const ImgExporter: React.FC<ImgExporterProps> = ({ type = "png" }) => {
  const trigger = useImgExporter(type)
  return <Button onClick={() => trigger()}>export</Button>
}

export default ImgExporter
