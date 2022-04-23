import EditorComponentWrapper from "../EditorComponentWrapper"
import AnimationExporter from "../Exporter/AnimationExporter"
import ImgExporter from "../Exporter/ImgExporter"
import SvgExporter from "../Exporter/SvgExporter"
import HandBook from "../Handbook"

const MenuBar: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <EditorComponentWrapper active={active} direction="bottom">
      <div className="fixed top-0 left-0 w-full flex justify-center">
        <div className="w-[800px] h-12 bg-white">
          <ImgExporter></ImgExporter>
          <AnimationExporter></AnimationExporter>
          <SvgExporter></SvgExporter>
          <HandBook></HandBook>
        </div>
      </div>
    </EditorComponentWrapper>
  )
}

export default MenuBar
