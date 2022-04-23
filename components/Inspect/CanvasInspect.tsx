import { selectMetaData } from "../../store/editorStore/selectors"
import useStore from "../../store/editorStore/store"
import NumberInput from "../UI/NumberInput"
import Switch from "../UI/Switch"
import ColorPicker from "../UI/ColorPicker"

const CanvasInspect: React.FC = () => {
  const metaData = useStore(selectMetaData)
  const updateMetaData = useStore((state) => state.updateMetaData)
  return (
    <div>
      <div>
        width:
        <NumberInput
          value={metaData.size.width}
          onChange={(v) => updateMetaData({ size: { width: v, height: metaData.size.height } })}
        ></NumberInput>{" "}
      </div>
      <div>
        height:
        <NumberInput
          value={metaData.size.height}
          onChange={(v) => updateMetaData({ size: { width: metaData.size.width, height: v } })}
        ></NumberInput>
      </div>
      <div>
        scale:
        <NumberInput
          value={metaData.scale}
          onChange={(v) => updateMetaData({ scale: v })}
        ></NumberInput>
      </div>
      <div>Ruller:</div>
      <div>
        show:
        <Switch
          checked={metaData.ruler.visible}
          onChange={(v) => updateMetaData({ ruler: { ...metaData.ruler, visible: v } })}
        ></Switch>
      </div>
      <div>
        color:
        <ColorPicker
          value={metaData.ruler.color || ""}
          onChange={(v) => updateMetaData({ ruler: { ...metaData.ruler, color: v } })}
        ></ColorPicker>
      </div>
    </div>
  )
}

export default CanvasInspect
