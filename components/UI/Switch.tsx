import cx from "classnames"

type SwitchProps = {
  checked: boolean
  onChange: (v: boolean) => void
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <div
      className={cx("flex w-8 h-4 bg-black/10", checked && "bg-green-500/40 justify-end")}
      onClick={() => onChange(!checked)}
    >
      <div className={cx("w-4 h-4 bg-black/70", checked && "bg-green-500/70")}></div>
    </div>
  )
}

export default Switch
