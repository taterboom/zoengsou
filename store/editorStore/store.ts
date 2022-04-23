import produce from "immer"
import { nanoid } from "nanoid"
import { range } from "ramda"
import create from "zustand"
import { combine, subscribeWithSelector } from "zustand/middleware"
import { imageContain, createImageFromFile, getGridsFromImageData } from "../../utils/imageHelper"
import { log } from "../middlewares"
import { createFrame, createLayer, createSurface, initDataBase } from "./utils"

export type Color = null | string

export type ID = string

export type Position = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type Frame = {
  id: ID
  surfacesOrder: Array<ID>
}

export type Layer = {
  id: ID
  name: string
  hidden: boolean
  surfacesOrder: Array<ID>
}

export type Surface = {
  id: ID
  layerId: ID
  frameId: ID
  grids: Array<Color>
}

export type DataBase = {
  layersOrder: Array<ID>
  framesOrder: Array<ID>
  layerStore: {
    [id: ID]: Layer
  }
  frameStore: {
    [id: ID]: Frame
  }
  surfaceStore: {
    [id: ID]: Surface
  }
  position: Position
  metaData: {
    size: Size
    scale: number // 画布缩放倍数
    ratio: number // 画布元素缩放倍数，为了解决devicePixelRatio引起的模糊问题
    ruler: {
      color: Color
      visible: boolean
    }
  }
  pressing: boolean // 鼠标按下
  activeGridIndex: number // 当前鼠标在画布的定位
  activeSurfaceId: ID // 当前图层
  animationConfig: {
    interval: number
  }
}

const database = combine(initDataBase({ example: true }), (set, get) => ({
  zoomIn: () => {
    set((state) => ({
      metaData: produce(state.metaData, (draft) => {
        draft.scale *= 2
      }),
    }))
  },
  updatePressing: (pressing: boolean) => {
    set({
      pressing,
    })
  },
  updateActiveGridIndex: (x: number, y: number) => {
    const index = y * get().metaData.size.width + x
    set({
      activeGridIndex: index,
    })
  },
  updateSurface: (id: ID, data: Partial<Surface>) => {
    set((state) =>
      produce(state, (draft) => {
        draft.surfaceStore[id] = {
          ...draft.surfaceStore[id],
          ...data,
        }
      })
    )
  },
  updateActiveSurface: (data: Partial<Surface>) => {
    const { activeSurfaceId } = get()
    set((state) =>
      produce(state, (draft) => {
        draft.surfaceStore[activeSurfaceId] = {
          ...draft.surfaceStore[activeSurfaceId],
          ...data,
        }
      })
    )
  },
  updateActiveGrid: (color: Color) => {
    const { activeGridIndex, activeSurfaceId } = get()
    set((state) =>
      produce(state, (draft) => {
        draft.surfaceStore[activeSurfaceId].grids[activeGridIndex] = color
      })
    )
  },
  updateActiveSurfaceId: (id: ID) => {
    set({
      activeSurfaceId: id,
    })
  },
  addLayer: () => {
    const { framesOrder, metaData, layersOrder } = get()
    set((state) =>
      produce(state, (draft) => {
        const count = framesOrder.length
        // 生成frame数的surface id
        const surfaceIds = range(0, count).map(() => nanoid())
        const layer = createLayer({
          surfacesOrder: surfaceIds,
          index: layersOrder.length,
        })
        // 添加layer
        draft.layerStore[layer.id] = layer
        draft.layersOrder.unshift(layer.id)
        surfaceIds.forEach((id, index) => {
          const frameId = framesOrder[index]
          const surface: Surface = createSurface({
            id,
            frameId,
            layerId: layer.id,
            count: metaData.size.width * metaData.size.height,
          })
          // frame添加surface
          draft.frameStore[frameId].surfacesOrder.unshift(id)
          // 添加surface
          draft.surfaceStore[id] = surface
        })
      })
    )
  },
  addFrame: () => {
    const { metaData, layersOrder } = get()
    set((state) =>
      produce(state, (draft) => {
        const count = layersOrder.length
        // 生成layer数的surface id
        const surfaceIds = range(0, count).map(() => nanoid())
        const frame = createFrame({
          surfacesOrder: surfaceIds,
        })
        // 添加frame
        draft.frameStore[frame.id] = frame
        draft.framesOrder.push(frame.id)
        surfaceIds.forEach((id, index) => {
          const layerId = layersOrder[index]
          const surface: Surface = createSurface({
            id,
            frameId: frame.id,
            layerId,
            count: metaData.size.width * metaData.size.height,
          })
          // layer添加surface
          draft.layerStore[layerId].surfacesOrder.push(id)
          // 添加surface
          draft.surfaceStore[id] = surface
        })
      })
    )
  },
  // TODO width/height增加后的变化
  updateMetaData: (data: Partial<DataBase["metaData"]>) => {
    set((state) => {
      return {
        metaData: {
          ...state.metaData,
          ...data,
        },
      }
    })
  },
  positionMove: (delta: Position) => {
    set((state) =>
      produce(state, (draft) => {
        draft.position.x += delta.x
        draft.position.y += delta.y
      })
    )
  },
  play: () => {
    const { frameStore, framesOrder, surfaceStore, activeSurfaceId } = get()
    const activeSurface = surfaceStore[activeSurfaceId]
    const activeFrameId = activeSurface.frameId
    const activeFrameIndex = framesOrder.indexOf(activeFrameId)
    const nextFrameIndex = activeFrameIndex === framesOrder.length - 1 ? 0 : activeFrameIndex + 1
    const nextFrameId = framesOrder[nextFrameIndex]
    const nextFrame = frameStore[nextFrameId]
    const nextActiveSurfaceId = nextFrame.surfacesOrder[0]
    set({ activeSurfaceId: nextActiveSurfaceId })
  },
  updateAnimationConfig: (data: Partial<DataBase["animationConfig"]>) => {
    set((state) => ({
      animationConfig: {
        ...state.animationConfig,
        ...data,
      },
    }))
  },
}))

const useStore = create(subscribeWithSelector(log(database)))

export default useStore
