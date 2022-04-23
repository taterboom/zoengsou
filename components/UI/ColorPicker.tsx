import classNames from "classnames"
import { useRef, useState } from "react"
import { SketchPicker } from "react-color"
import useClickAway from "../../hooks/useClickAway"
import Button from "./Button"

type ColorPickerProps = {
  value: string
  onChange?: (hex: string) => void
}
const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [pickerVisible, setPickerVisible] = useState(false)
  const contrainerRef = useRef<HTMLDivElement>(null)
  useClickAway(() => {
    setPickerVisible(false)
  }, contrainerRef)
  return (
    <div className="relative" ref={contrainerRef}>
      <Button>
        <div
          className="w-[32px] h-[32px]"
          style={{ background: value }}
          onClick={() => {
            setPickerVisible(true)
          }}
        ></div>
      </Button>
      <SketchPicker
        className={classNames(!pickerVisible && "hidden")}
        color={value}
        onChange={(e) => onChange?.(e.hex)}
      ></SketchPicker>
    </div>
  )
}

export default ColorPicker
