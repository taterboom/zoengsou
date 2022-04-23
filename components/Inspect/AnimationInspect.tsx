import { useEffect, useRef, useState } from "react"
import useStore from "../../store/editorStore/store"
import Button from "../UI/Button"
import NumberInput from "../UI/NumberInput"

const AnimationController: React.FC = () => {
  const [playing, setPlaying] = useState(false)
  const play = useRef(useStore((state) => state.play))
  const animationConfig = useStore((state) => state.animationConfig)
  const animationConfigRef = useRef(animationConfig)
  animationConfigRef.current = animationConfig
  useEffect(() => {
    if (playing) {
      play.current()
      const id = setInterval(() => {
        play.current()
      }, animationConfigRef.current.interval)
      return () => {
        clearInterval(id)
      }
    }
  }, [playing])
  return (
    <Button
      onClick={() => {
        setPlaying(!playing)
      }}
    >
      {playing ? "⏸" : "▶"}
    </Button>
  )
}

const AnimationInterval: React.FC = () => {
  const animationConfig = useStore((state) => state.animationConfig)
  const updateAnimationConfig = useStore((state) => state.updateAnimationConfig)
  return (
    <div>
      interval:
      <NumberInput
        value={animationConfig.interval}
        onChange={(v) => updateAnimationConfig({ interval: v })}
      ></NumberInput>
    </div>
  )
}

const AnimationInspect: React.FC = () => {
  return (
    <div>
      <AnimationController></AnimationController>
      <AnimationInterval></AnimationInterval>
    </div>
  )
}

export default AnimationInspect
