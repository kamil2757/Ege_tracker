import styles from "./MyChart.module.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MyChart({ data, range }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="1 0" />

        <XAxis dataKey="date" tick={{ fontSize: "0.75rem" }} />

        <YAxis domain={range} tick={{ fontSize: "0.75rem" }} width={30} />

        <Tooltip
          contentStyle={{
            borderRadius: 6,
            border: "2px solid #EDF0F4",
          }}
        />

        <Line
          type="monotone"
          dataKey="score"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
