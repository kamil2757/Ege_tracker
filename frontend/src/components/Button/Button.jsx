import styles from "./button.module.scss";

export default function Button({
  children,
  onClick,
  variant = "filled",
  disabled = false,
  mini = false,
}) {
  if (mini) {
    return (
      <button
        className={`${styles.miniButton} ${
          disabled ? styles.disabled : ""
        }`}
        disabled={disabled}
        
        onClick={(onClick)}
      >
        {children}
      </button>
    );
  } else {
    return (
      <button
        className={`${styles.Button} ${styles[variant]}  ${
          disabled ? styles.disabled : ""
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}
