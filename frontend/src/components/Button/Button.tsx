import styles from "./Button.module.scss";
import { ReactNode, MouseEvent, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  filled: boolean;
  disabled: boolean;
  size?: 's' | 'm'
}

export default function Button({
  children,
  className,
  filled = true,
  disabled = false,
  size = 'm',
  ...rest
}: ButtonProps) {
  const buttonClasses = clsx(
    styles.Button,
    styles[size],
    {[styles.disabled]: disabled,
      [styles.filled]: filled
    },
    className
  )

  return (
    <button
    className={buttonClasses}
    disabled={disabled}
    {...rest}>
      {children}
    </button>
  )
}
