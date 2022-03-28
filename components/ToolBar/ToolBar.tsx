import { useEffect, useRef, useState } from "react"
import { SketchPicker } from "react-color"
import shallow from "zustand/shallow"
import useStore from "../../store/editorStore"
import { selectActiveSurface } from "../../store/editorStore/selectors"
import usePaletteStore from "../../store/palette/store"
import Button from "../Button"

const TOOL_PENCIL = "TOOL_PENCIL"
const TOOL_ERASER = "TOOL_ERASER"
const TOOL_FILL = "TOOL_FILL"

type ToolButtonProps = {
  checked: boolean
  onClick: () => any
}

const ToolButtonPencel: React.FC<ToolButtonProps> = ({ checked, onClick }) => {
  const updateActiveGridRef = useRef(useStore((state) => state.updateActiveGrid))
  const checkedRef = useRef(checked)
  checkedRef.current = checked

  useEffect(() => {
    return useStore.subscribe(
      (state) => ({
        pressing: state.pressing,
        activeGridIndex: state.activeGridIndex,
      }),
      ({ pressing, activeGridIndex }) => {
        if (!checkedRef.current) return
        if (pressing && activeGridIndex >= 0) {
          updateActiveGridRef.current(usePaletteStore.getState().color)
        }
      },
      {
        equalityFn: shallow,
      }
    )
  }, [])

  return <Button onClick={onClick}>Pencil {checked + ""}</Button>
}

const ToolButtonEraser: React.FC<ToolButtonProps> = ({ checked, onClick }) => {
  const updateActiveGridRef = useRef(useStore((state) => state.updateActiveGrid))
  const checkedRef = useRef(checked)
  checkedRef.current = checked

  useEffect(() => {
    return useStore.subscribe(
      (state) => ({
        pressing: state.pressing,
        activeGridIndex: state.activeGridIndex,
      }),
      ({ pressing, activeGridIndex }) => {
        if (!checkedRef.current) return
        if (pressing && activeGridIndex >= 0) {
          updateActiveGridRef.current(null)
        }
      },
      {
        equalityFn: shallow,
      }
    )
  }, [])

  return <Button onClick={onClick}>Eraser {checked + ""}</Button>
}

const ToolButtonFill: React.FC<ToolButtonProps> = ({ checked, onClick }) => {
  const updateSurfaceRef = useRef(useStore((state) => state.updateSurface))
  const checkedRef = useRef(checked)
  checkedRef.current = checked

  useEffect(() => {
    return useStore.subscribe(
      (state) => state.pressing,
      (pressing) => {
        if (!checkedRef.current) return
        if (pressing) {
          const activeSurface = selectActiveSurface(useStore.getState())
          const color = usePaletteStore.getState().color
          updateSurfaceRef.current(activeSurface.id, {
            grids: activeSurface.grids.map(() => color),
          })
        }
      }
    )
  }, [])

  return <Button onClick={onClick}>Fill {checked + ""}</Button>
}

const PaletteButton: React.FC = () => {
  const color = usePaletteStore((state) => state.color)
  const updateColor = usePaletteStore((state) => state.updateColor)
  return (
    <div className="group relative">
      <Button>
        <div className="w-[32px] h-[32px]" style={{ background: color }}></div>
      </Button>
      <SketchPicker
        className="absolute left-full top-0 hidden group-hover:block"
        color={color}
        onChange={(e) => updateColor(e.hex)}
      ></SketchPicker>
    </div>
  )
}

const ToolBarContainer: React.FC = ({}) => {
  const [currentToolId, setCurrentToolId] = useState<string>(TOOL_PENCIL)

  const onCheck = (id: string) => {
    if (currentToolId === id) {
      setCurrentToolId("")
    } else {
      setCurrentToolId(id)
    }
  }

  return (
    <div className="fixed top-20 left-0 w-12 h-[360px] bg-white">
      <ToolButtonPencel
        checked={currentToolId === TOOL_PENCIL}
        onClick={() => onCheck(TOOL_PENCIL)}
      ></ToolButtonPencel>
      <ToolButtonEraser
        checked={currentToolId === TOOL_ERASER}
        onClick={() => onCheck(TOOL_ERASER)}
      ></ToolButtonEraser>
      <ToolButtonFill
        checked={currentToolId === TOOL_FILL}
        onClick={() => onCheck(TOOL_FILL)}
      ></ToolButtonFill>

      <PaletteButton></PaletteButton>
    </div>
  )
}

export default ToolBarContainer
