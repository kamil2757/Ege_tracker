import styles from "./Select.module.scss";

export default function Select({
  options,
  onChange,
  value = ''
}) {
  return (
    <select onChange={onChange} className={styles.Select}  value={value || ""}>
      <option value="" disabled>
         Выберите предмет
      </option>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
