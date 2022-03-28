import produce from "immer"
import { nanoid } from "nanoid"
import { range } from "ramda"
import create from "zustand"
import { combine, subscribeWithSelector } from "zustand/middleware"
import { log } from "../middlewares"
import { createLayer, createSurface, initDataBase } from "./utils"

export type Color = null | string

export type ID = string

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
  metaData: {
    size: Size
    scale: number // 画布缩放倍数
    ratio: number // 画布元素缩放倍数，为了解决devicePixelRatio引起的模糊问题
    rulerColor: Color
  }
  pressing: boolean // 鼠标按下
  activeGridIndex: number // 当前鼠标在画布的定位
  activeSurfaceId: ID // 当前图层
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
        const surfaceIds = range(0, count).map(() => nanoid())
        const layer = createLayer({
          surfacesOrder: surfaceIds,
          index: layersOrder.length,
        })
        draft.layerStore[layer.id] = layer
        draft.layersOrder.push(layer.id)
        surfaceIds.forEach((id, index) => {
          const frameId = framesOrder[index]
          const surface: Surface = createSurface({
            id,
            frameId,
            layerId: layer.id,
            count: metaData.size.width * metaData.size.height,
          })
          draft.frameStore[frameId].surfacesOrder.push(id)
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
}))

const useStore = create(subscribeWithSelector(log(database)))

export default useStore
