import styles from "./Tab.module.scss";

export default function Tab({ children, onClick, active }) {
  return (
    <button
      className={`${styles.Tab} ${active ? styles.activeTab : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
