import produce from "immer"
import create from "zustand"
import { combine } from "zustand/middleware"
import { log } from "../middlewares"

const store = combine(
  {
    color: "#333333",
  },
  (set, get) => ({
    updateColor: (color: string) => {
      set({
        color,
      })
    },
  })
)

const usePaletteStore = create(store)

export default usePaletteStore
