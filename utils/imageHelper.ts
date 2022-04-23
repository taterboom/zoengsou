import { range } from "ramda"

type RGBA = [number, number, number, number]

export const parseHex = (hex: string): RGBA => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const a = parseInt(hex.slice(7, 9) || "ff", 16)
  return [r, g, b, a]
}

export const formatHex = (rgba: RGBA) => {
  return `#${rgba.map((num) => num.toString(16).padStart(2, "0")).join("")}`
}

export const fillRectImageData = (
  data: Uint8ClampedArray,
  hex: string,
  x: number,
  y: number,
  canvasWidth: number,
  rectSize: number
) => {
  const rgba = parseHex(hex)
  for (let i = 0; i < rectSize; i++) {
    for (let j = 0; j < rectSize; j++) {
      const dx = 4 * (x + (y + i) * canvasWidth + j)
      data[dx] = rgba[0]
      data[dx + 1] = rgba[1]
      data[dx + 2] = rgba[2]
      data[dx + 3] = rgba[3]
    }
  }
}

export const getGridsFromImageData = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  scale: number
) => {
  const grids = []
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const dx = i * width + j
      // 取一个格子中间的颜色
      const dataDx = 4 * (scale * scale * (i + 1 / 2) * width + scale * (j + 1 / 2))
      grids[dx] = formatHex(range(0, 4).map((num) => data[dataDx + num]) as RGBA)
    }
  }
  return grids
}

export const createImageFromFile = (file: File) => {
  const image = document.createElement("img")
  image.src = URL.createObjectURL(file)
  return new Promise<HTMLImageElement>((res, rej) => {
    if (image.complete) {
      res(image)
      URL.revokeObjectURL(image.src)
    } else {
      image.onload = () => {
        res(image)
        URL.revokeObjectURL(image.src)
      }
      image.onerror = (e) => {
        rej(e)
      }
    }
  })
}

// 计算一个尺寸在容器内缩放居中后的尺寸
export const imageContain = (
  innerWidth: number,
  innerHeight: number,
  outerWidth: number,
  outerHeight: number,
  center: boolean = true
) => {
  const innerAspectRatio = innerWidth / innerHeight
  const outerAspectRatio = outerWidth / outerHeight
  let x: number = 0
  let y: number = 0
  let containedWidth: number
  let containedHeight: number
  if (innerAspectRatio > outerAspectRatio) {
    containedWidth = Math.min(innerWidth, outerWidth)
    containedHeight = containedWidth / innerAspectRatio
  } else {
    containedHeight = Math.min(innerHeight, outerHeight)
    containedWidth = containedHeight * innerAspectRatio
  }
  if (center) {
    x = (outerWidth - containedWidth) / 2
    y = (outerHeight - containedHeight) / 2
  }

  return [x, y, containedWidth, containedHeight]
}
