import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CircularProgress({ value = 10, max = 100 }) {
  return (
    <div style={{ width: 120 }}>
      <CircularProgressbar
        value={value}
        maxValue={max}
        text={`${value}/${max}`}
        strokeWidth={10}
        styles={buildStyles({
          pathColor: "#e6ad60",
          trailColor: "#ffffffff",
          textColor: "#000",
          textSize: 14,
          pathTransitionDuration: 0.6,
        })}
      />
    </div>
  );
}
