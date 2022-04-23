import { DataBase } from "./store"

export const selectMetaData = (state: DataBase) => state.metaData

export const selectActiveSurface = (state: DataBase) => state.surfaceStore[state.activeSurfaceId]
export const selectActiveFrame = (state: DataBase) => {
  const activeSurface = selectActiveSurface(state)
  const activeFrame = state.frameStore[activeSurface.frameId]
  return activeFrame
}
