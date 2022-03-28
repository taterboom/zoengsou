import classNames from "classnames"
import { Children, cloneElement, isValidElement } from "react"

export const Tabs: React.FC<{
  className?: string
  value: number
  onChange: (value: number) => void
}> = ({ className, value, onChange, children }) => {
  return (
    <div className={classNames("flex", className)}>
      {Children.map(children, (child, index) =>
        isValidElement(child)
          ? cloneElement(child, {
              ...child.props,
              active: value === index,
              onClick: () => onChange(index),
            })
          : child
      )}
    </div>
  )
}

export const Tab: React.FC<{ className?: string; active?: boolean; onClick?: () => void }> = ({
  className,
  active,
  onClick,
  children,
}) => {
  return (
    <div className={classNames(className, { active })} onClick={onClick}>
      {children}
    </div>
  )
}
