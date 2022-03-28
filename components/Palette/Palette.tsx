import { SketchPicker } from "react-color"

const Palette: React.FC = () => {
  return (
    <div className="fixed bottom-[40px] left-0 bg-white">
      <SketchPicker></SketchPicker>
    </div>
  )
}

export default Palette
