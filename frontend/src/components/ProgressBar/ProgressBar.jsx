import styles from "./ProgressBar.module.scss";

export default function ProgressBar({
  progress = 0,
  widthBar = "400px",
  heightBar = "20px",
  backgroundColorBar = "white",
}) {
  function getColors(p) {
    if (p < 50) return "#DD5E5E";
    if (50 <= p && p < 76) return "#DDA85E";
    return "#7CDD5E";
  }

  const colorBar = getColors(progress);

  return (
    <div
      style={{
        width: widthBar,
        height: heightBar,
        backgroundColor: backgroundColorBar,
      }}
      className={styles.ProgressBar}
    >
      <div style={{ width: `${progress}%`, backgroundColor: colorBar }} className={styles.Progress}></div>
    </div>
  );
}
