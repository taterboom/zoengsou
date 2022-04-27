import produce, { Draft } from "immer"
import { pipe } from "ramda"
import create, { GetState, SetState, State, StateCreator, StoreApi } from "zustand"

export const log =
  <
    T extends State,
    CustomSetState extends SetState<T>,
    CustomGetState extends GetState<T>,
    CustomStoreApi extends StoreApi<T>
  >(
    config: StateCreator<T, SetState<T>, CustomGetState, CustomStoreApi>
  ): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
  (set, get, api) =>
    config(
      (args) => {
        console.log("--- applying", args)
        set(args)
        console.log("--- new state", get())
      },
      get,
      api
    )

export const immerMiddleware =
  <
    T extends State,
    CustomSetState extends SetState<T>,
    CustomGetState extends GetState<T>,
    CustomStoreApi extends StoreApi<T>
  >(
    config: StateCreator<
      T,
      (partial: ((draft: Draft<T>) => void) | T, replace?: boolean) => void,
      CustomGetState,
      CustomStoreApi
    >
  ): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        const nextState =
          typeof partial === "function"
            ? produce(partial as (state: Draft<T>) => T)
            : (partial as T)
        return set(nextState, replace)
      },
      get,
      api
    )

const snapshotStore = {
  limit: 15,
  currentIndex: -1,
  snapshots: [] as any[],
}
export type SnapshotState = {
  snapshot?: () => void
  undo?: () => void
  redo?: () => void
}
export const snapshotMiddleware =
  <
    T extends State,
    CustomSetState extends SetState<T>,
    CustomGetState extends GetState<T>,
    CustomStoreApi extends StoreApi<T>
  >(
    config: StateCreator<T, SetState<T>, CustomGetState, CustomStoreApi>
  ): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
  (set, get, api) =>
    config(
      (args) => {
        const snapshot = () => {
          if (snapshotStore.snapshots.length >= snapshotStore.limit) {
            snapshotStore.snapshots.shift()
          } else {
            snapshotStore.currentIndex += 1
          }
          snapshotStore.snapshots.splice(snapshotStore.currentIndex, 1, get())
        }
        if (snapshotStore.currentIndex === -1) {
          snapshot()
        }
        set({
          // @ts-ignore
          snapshot,
          undo: () => {
            snapshotStore.currentIndex = Math.max(0, snapshotStore.currentIndex - 1)
            set(snapshotStore.snapshots[snapshotStore.currentIndex])
          },
          redo: () => {
            snapshotStore.currentIndex = Math.min(
              snapshotStore.snapshots.length - 1,
              snapshotStore.currentIndex + 1
            )
            set(snapshotStore.snapshots[snapshotStore.currentIndex])
          },
        })
        set(args)
      },
      get,
      api
    )
