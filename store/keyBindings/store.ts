import produce from "immer"
import create from "zustand"
import { combine } from "zustand/middleware"
import { log } from "../middlewares"

const store = combine(
  {
    bindings: {} as { [x: string]: { cb: (e: any) => any; desc: string } },
  },
  (set, get) => ({
    addBinding: <T extends Event>(keys: string, desc: string, cb: (e: T) => any) => {
      set((state) =>
        produce(state, (draft) => {
          console.log(keys)
          if (keys in draft.bindings) {
            return
          }
          draft.bindings[keys] = {
            cb,
            desc,
          }
        })
      )
    },
    removeBinding: (keys: string) => {
      set((state) =>
        produce(state, (draft) => {
          if (keys in draft.bindings) {
            delete draft.bindings[keys]
          }
        })
      )
    },
  })
)

const useKeyBindingsStore = create(log(store))

export default useKeyBindingsStore
