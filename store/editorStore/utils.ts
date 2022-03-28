import { nanoid } from "nanoid"
import { range } from "ramda"
import {
  DEFAULT_HEIGHT,
  DEFAULT_RATIO,
  DEFAULT_RULER_COLOR,
  DEFAULT_SCALE,
  DEFAULT_WIDTH,
} from "./constants"
import { Color, DataBase, Frame, Layer, Size, Surface } from "./store"

export const createLayer = (options: {
  surfacesOrder: Layer["surfacesOrder"]
  index?: number
}): Layer => {
  const { surfacesOrder, index = 0 } = options
  return {
    id: nanoid(),
    name: `Layer ${index}`,
    hidden: false,
    surfacesOrder,
  }
}

export const createFrame = (options: { surfacesOrder: Layer["surfacesOrder"] }): Frame => {
  const { surfacesOrder } = options
  return {
    id: nanoid(),
    surfacesOrder,
  }
}

export const createSurface = (options: {
  id?: string
  frameId: string
  layerId: string
  grids?: Color[]
  count?: number
}): Surface => {
  const { id, frameId, layerId, grids, count = 1 } = options
  return {
    id: id || nanoid(),
    frameId,
    layerId,
    grids: grids ? grids : range(0, count).map(() => null),
  }
}

export const initDataBase = (options?: { example?: boolean; size?: Size }): DataBase => {
  const { example, size } = options || {}
  const initialSize = size || {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  }
  const surfaceId = nanoid()
  const initialFrame = createLayer({ surfacesOrder: [surfaceId] })
  const initialLayer = createLayer({ surfacesOrder: [surfaceId] })
  const initialSurface = createSurface({
    id: surfaceId,
    frameId: initialFrame.id,
    layerId: initialLayer.id,
    count: initialSize.width * initialSize.height,
  })
  return {
    metaData: {
      size: initialSize,
      scale: DEFAULT_SCALE,
      ratio: DEFAULT_RATIO,
      rulerColor: DEFAULT_RULER_COLOR,
    },
    layersOrder: [initialLayer.id],
    framesOrder: [initialFrame.id],
    layerStore: {
      [initialLayer.id]: initialLayer,
    },
    frameStore: {
      [initialFrame.id]: initialFrame,
    },
    surfaceStore: {
      [initialSurface.id]: initialSurface,
    },
    pressing: false,
    activeGridIndex: -1,
    activeSurfaceId: initialSurface.id,
  }
}
