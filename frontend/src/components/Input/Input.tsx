import styles from "./Input.module.scss";

export default function Input({
  placeholder,
  type = "text",
  value,
  name,
  onChange,
  autoComplete,
  className ,
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      autoComplete={autoComplete}
      className={`${styles.input} ${className || ""}`}
      {...props}
    />
  );
}
