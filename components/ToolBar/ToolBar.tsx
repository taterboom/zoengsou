import { useEffect, useRef, useState } from "react"
import shallow from "zustand/shallow"
import useStore from "../../store/editorStore"
import { selectActiveSurface } from "../../store/editorStore/selectors"
import usePaletteStore from "../../store/palette/store"
import Button from "../UI/Button"
import EditorComponentWrapper from "../EditorComponentWrapper"
import ColorPicker from "../UI/ColorPicker"

const setCursor = (cursor: string) => {
  const stageContainer = document.getElementById("stage-container")
  console.log(cursor)
  if (!stageContainer) return
  stageContainer.style.cursor = cursor
}

const TOOL_PENCIL = "TOOL_PENCIL"
const TOOL_ERASER = "TOOL_ERASER"
const TOOL_FILL = "TOOL_FILL"
const TOOL_GRAB = "TOOL_GRAB"

type ToolButtonProps = {
  checked: boolean
  onClick: () => any
}

const ToolButtonGrab: React.FC<ToolButtonProps> = ({ checked, onClick }) => {
  const move = useRef(useStore((state) => state.positionMove))
  const checkedRef = useRef(checked)
  checkedRef.current = checked

  useEffect(() => {
    const stageContainer = document.getElementById("stage-container")
    const stage = document.getElementById("stage")
    if (!stageContainer || !stage) return
    const onMousedown = () => {
      if (!checkedRef.current) return
      setCursor("grabbing")
      stageContainer.addEventListener("mousemove", onMousemove)
      document.addEventListener("mouseup", onMouseup)
    }
    const onMouseup = () => {
      if (checkedRef.current) {
        setCursor("grab")
      }
      stageContainer.removeEventListener("mousemove", onMousemove)
      document.removeEventListener("mouseup", onMouseup)
    }
    const onMousemove = (e: MouseEvent) => {
      move.current({
        x: e.movementX,
        y: e.movementY,
      })
    }
    stageContainer.addEventListener("mousedown", onMousedown)
    return () => {
      stageContainer.removeEventListener("mousedown", onMousedown)
    }
  }, [])

  return <Button onClick={onClick}>Grab {checked + ""}</Button>
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
  return <ColorPicker value={color} onChange={(v) => updateColor(v)}></ColorPicker>
}

const ToolBarContainer: React.FC<{ active: boolean }> = ({ active }) => {
  const [currentToolId, setCurrentToolId] = useState<string>(TOOL_PENCIL)

  const onCheck = (id: string) => {
    if (currentToolId === id) {
      setCurrentToolId("")
    } else {
      setCurrentToolId(id)
    }
  }

  useEffect(() => {
    const cursor: { [x: string]: string } = {
      [TOOL_GRAB]: "grab",
      // [TOOL_PENCIL]: "grab",
      // [TOOL_ERASER]: "grab",
      // [TOOL_FILL]: "grab",
    }
    if (currentToolId in cursor) {
      setCursor(cursor[currentToolId])
    } else {
      setCursor("default")
    }
  }, [currentToolId])

  return (
    <EditorComponentWrapper active={active} direction="right">
      <div className="fixed top-0 left-0 h-full pt-20">
        <div className="w-12 h-[360px] bg-white">
          <ToolButtonGrab
            checked={currentToolId === TOOL_GRAB}
            onClick={() => onCheck(TOOL_GRAB)}
          ></ToolButtonGrab>
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
      </div>
    </EditorComponentWrapper>
  )
}

export default ToolBarContainer
