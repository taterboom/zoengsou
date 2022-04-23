import { selectActiveFrame, selectActiveSurface } from "../../store/editorStore/selectors"
import useStore, { Color } from "../../store/editorStore/store"
import { download } from "../../utils/download"
import { fillRectImageData } from "../../utils/imageHelper"
import Button from "../UI/Button"

const useExporter = (size: number) => {
  const activeFrame = useStore(selectActiveFrame)
  const surfaceStore = useStore((state) => state.surfaceStore)
  const metaData = useStore((state) => state.metaData)

  const trigger = () => {
    // [x, y, h] => M{x} {y}h{h}
    const colorMap = new Map<string, Array<[number, number, number]>>()
    for (let surfaceId of [...activeFrame.surfacesOrder].reverse()) {
      const surface = surfaceStore[surfaceId]
      let prevColor: Color = null
      let prevX = -1
      let prevY = -1
      for (let i = 0; i < metaData.size.height; i++) {
        for (let j = 0; j < metaData.size.width; j++) {
          const color = surface.grids[i * metaData.size.width + j]
          if (color) {
            if (color === prevColor) {
              const data = colorMap.get(color)!
              if (prevY === i) {
                data[data?.length - 1][2] += 1
              } else {
                data.push([j, i, 1])
              }
            } else {
              colorMap.has(color)
                ? colorMap.get(color)?.push([j, i, 1])
                : colorMap.set(color, [[j, i, 1]])
            }
          }
          prevColor = color
          prevX = j
          prevY = i
        }
      }
    }
    const svgStr = `<svg width="${metaData.size.width * size}" height="${
      metaData.size.height * size
    }" viewBox="0 0 ${metaData.size.width} ${
      metaData.size.height
    }" xmlns="http://www.w3.org/2000/svg">${[...colorMap].map(
      ([color, positions]) =>
        `<path d="${positions
          .map(([x, y, h]) => `M${x} ${y}h${h}`)
          .join(" ")}" stroke="${color}"></path>`
    )}</svg>`

    const svgBase64 = "data:image/svg+xml;base64," + window.btoa(svgStr)
    download(`zoengsou.svg`, svgBase64)
  }

  return trigger
}

const SvgExporter: React.FC<{ size?: number }> = ({ size = 4 }) => {
  const trigger = useExporter(size)
  return <Button onClick={() => trigger()}>export svg</Button>
}

export default SvgExporter
