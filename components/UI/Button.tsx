type ButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button className="border" onClick={(e) => onClick?.(e)}>
      {children}
    </button>
  )
}

export default Button
