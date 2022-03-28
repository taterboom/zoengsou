import { DataBase } from "./store"

export const selectMetaData = (state: DataBase) => state.metaData

export const selectActiveSurface = (state: DataBase) => state.surfaceStore[state.activeSurfaceId]
// export const selectTopFrame = (state: DataBase) => state.frameStore[state.frameIds[0]]
