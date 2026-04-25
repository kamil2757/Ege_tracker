import styles from "./MiniAnalytics.module.scss";
import Tab from "../../../../components/Tab/Tab";
import Button from "../../../../components/Button/Button";
import MyChart from "../../../../components/MyChart/MyChart";
import { useState } from "react";

const subjects = [
  { id: "math", title: "Математика" },
  { id: "rus", title: "Русский" },
];

const trials = [
  {
    date: "2025-10-05",
    score: 40,
  },
  {
    date: "2025-10-20",
    score: 54,
  },
  {
    date: "2025-11-02",
    score: 77,
  },
  {
    date: "2025-11-18",
    score: 69,
  },
  {
    date: "2025-12-01",
    score: 85,
  },
];

export default function MiniAnalytics() {
  const [activeSubjectId, setActiveSubjectId] = useState("math");

  return (
    <div className={styles.MiniAnalytics}>
      <div className={styles.TabsBlock}>
        {subjects.map((subject) => (
          <Tab
            key={subject.id}
            onClick={() => setActiveSubjectId(subject.id)}
            active={subject.id === activeSubjectId}
          >
            {subject.title}
          </Tab>
        ))}
      </div>
      <div className={styles.ChartBlock}>
        <MyChart data={trials} range={[1, 100]}></MyChart>
      </div>
      <div className={styles.advice}>
        Отличная динамика по {activeSubjectId}. Ты движешься в правильном
        направлении — главное, не сбавлять темп
      </div>
    </div>
  );
}
