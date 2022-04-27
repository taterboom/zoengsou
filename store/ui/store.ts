import produce from "immer"
import create from "zustand"
import { combine, subscribeWithSelector } from "zustand/middleware"
import { log } from "../middlewares"

const store = combine(
  {
    pressing: false,
  },
  (set, get) => ({
    updatePressing: (pressing: boolean) => {
      set({
        pressing,
      })
    },
  })
)

const useUIStore = create(subscribeWithSelector(store))

export default useUIStore
