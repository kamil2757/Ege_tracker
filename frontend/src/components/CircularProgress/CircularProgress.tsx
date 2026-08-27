import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircularProgressbarProps {
  value: number;
  pathColor: string;
  trailColor: string;
  maxValue?: number;
  size?: string | number;
  textColor?: string;
}

export default function CircularProgress({
  value,
  pathColor,
  trailColor,
  maxValue = 100,
  size = "100%",
  textColor = "black",
}: CircularProgressbarProps) {
  const text = `${value}/${maxValue}`;

  return (
    <div style={{ width: size, height: size }} role="progressbar">
      <CircularProgressbar
        value={value}
        maxValue={maxValue}
        text={text}
        strokeWidth={10}
        styles={buildStyles({
          pathColor: pathColor,
          trailColor: trailColor,
          textColor: textColor,
          textSize: 14,
          pathTransitionDuration: 0.6,
        })}
      />
    </div>
  );
}
