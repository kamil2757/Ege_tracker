import styles from "./MainTasks.module.scss";
import ProgressBar from "../../../../components/ProgressBar/ProgressBar";
import TaskBlock from "../TaskBlock/TaskBlock";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function MainTasks() {
  const { subject, status } = useSelector((state) => state.subjects);

  // useEffect(() => {
  //   if (subject?.title) {
  //     console.log(subject);
  //     console.log(
  //       "d:",
  //       subject.tasks.slice(Math.floor(subject.tasks.length / 2)),
  //     );
  //   }
  // }, [subject]);

  // if (!subject) {
  //   return <div>Loading...</div>; // или null, или спиннер
  // }

  return (
    <div className={styles.MainTasks}>
      <div className={styles.block1}>
        {subject.title &&
          subject.tasks
            .slice(0, Math.floor(subject.tasks.length / 2))
            .map((task) => (
              <TaskBlock
                number={task.number}
                title={task.title}
                taskId={task.id}
                key={task.id}
                percent={task.understanding_percent}
              ></TaskBlock>
            ))}
      </div>
      <div className={styles.block2}>
        {subject.title &&
          subject.tasks
            .slice(Math.floor(subject.tasks.length / 2))
            .map((task) => (
              <TaskBlock
                number={task.number}
                title={task.title}
                taskId={task.id}
                key={task.id}
                percent={task.understanding_percent}
              ></TaskBlock>
            ))}
      </div>
    </div>
  );
}
