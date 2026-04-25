import styles from "./TaskBlock.module.scss";
import ProgressBar from "../../../../components/ProgressBar/ProgressBar";
import Button from "../../../../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../../../../store/subjectsSlice";

export default function TaskBlock({ number, title, taskId, percent }) {
  const dispath = useDispatch();
  const taskStatus = useSelector((state) => state.subjects.updateTaskStatusById[taskId]);

  function handleUpdateTask(id) {
    if (percent < 100 && taskStatus != 'loading') {
      dispath(updateTask({ taskId: id }));
    }
  }
  return (
    <div className={styles.TaskBlock}>
      <p className={styles.title}>
        {number}. {title}
      </p>
      <div className={styles.progressbar}>
        <ProgressBar progress={percent} widthBar="100%" heightBar="11px" />
      </div>
      <Button
        mini={true}
        onClick={() => handleUpdateTask(taskId)}
        disabled={taskStatus === "loading"}
      >
        <svg
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12H18M12 6V18"
            stroke="#5E95DD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </div>
  );
}
