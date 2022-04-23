const MIN = 1
const MAX = 1024

type NumberInputProps = {
  value: number
  min?: number
  max?: number
  onChange?: (value: number) => void
}
const NumberInput: React.FC<NumberInputProps> = ({ value, min = MIN, max = MAX, onChange }) => {
  return (
    <div className="inline-flex">
      <span
        onClick={() => {
          onChange?.(Math.max(value / 2, min))
        }}
      >
        -
      </span>
      <span>{value}</span>
      <span
        onClick={() => {
          onChange?.(Math.min(value * 2, max))
        }}
      >
        +
      </span>
    </div>
  )
}

export default NumberInput
