import styles from "./CreateTestModal.module.scss";
import ProgressBar from "../../../../components/ProgressBar/ProgressBar";
import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { createTest } from "../../../../store/subjectsSlice";

export default function CreateTestModal({onClose}) {
  const { subject } = useSelector((state) => state.subjects);
  const dispatch = useDispatch();
  const [scores, setScores] = useState({});
  const [secondaryScore, setSecondaryScore] = useState(0);

  function handleCreateTest() {
    const data = {
      subject_id: subject.id,
      title: "Пробник",
      tasks: {
        scores,
      },
    };
    try {
      dispatch(createTest(data));
      onClose()
      
    } catch (err) {
      console.error("Ошибка:", err);
    }
  }

  useEffect(() => {
    console.log("CreateTestModal: ", subject.tasks);
    if (subject) {
      const newScores = {};
      subject.tasks.forEach((t) => {
        newScores[t.number] = 0;
      });

      setScores(newScores);
    }
  }, [subject]);

  const primaryScore = useMemo(
    () =>
      Object.values(scores).reduce((acc, curr) => acc + Number(curr) || 0, 0),
    [scores],
  );

  // Максимальный балл — пересчитывается только когда subject меняется
  const maxScore = useMemo(
    () => subject?.tasks?.reduce((acc, curr) => acc + curr.max_score, 0) ?? 0,
    [subject],
  );

  useEffect(() => {
    conversionToSecondary();
  }, [primaryScore]);

  function conversionToSecondary() {
    if (primaryScore == 0) {
      setSecondaryScore(0);
    } else {
      setSecondaryScore(
        subject.score_conversions[primaryScore - 1].secondary_score,
      );
    }
  }

  function onClickTask(number) {
    setScores({ ...scores, [number]: Number(!scores[number]) });
  }

  function onChangeTaskBig(number, value, max) {
    if (value === "") {
      setScores({ ...scores, [number]: "" });
      return;
    }
    const numValue = Number(value);
    if (numValue <= max) {
      setScores({ ...scores, [number]: numValue });
    }
  }

  if (!subject) {
    return <div>Loading...</div>; // или null, или спиннер
  }

  return (
    <div className={styles.CreateTestModal}>
      <h1>Как ты написал пробник?</h1>
      <div className={styles.miniInfo}>
        <p>
          Отметь задания, которые ты решил правильно. Если за задание дают
          больше одного балла, введи свой результат.
        </p>
      </div>
      <div className={styles.tasksBlock}>
        {subject.tasks.map((t) => {
          const currentScore = scores[t.number] || 0;
          return t.max_score > 1 ? (
            <p className={styles.taskBig} key={t.id}>
              {t.number}
              <Input
                className={styles.TaskBig_input}
                type={"number"}
                min="0"
                placeholder="0"
                value={scores[t.number] ?? ""}
                onChange={(e) =>
                  onChangeTaskBig(t.number, e.target.value, t.max_score)
                }
              ></Input>
            </p>
          ) : (
            <button
              className={`${styles.task} ${currentScore == 1 ? styles.taskActive : ""}`}
              key={t.id}
              onClick={() => onClickTask(t.number)}
            >
              {t.number}
            </button>
          );
        })}
      </div>
      <div className={styles.InfoBlock}>
        <ProgressBar
          progress={(secondaryScore / 100) * 100}
          widthBar="100%"
          heightBar="12px"
        />
        <div className={styles.info}>
          <div className={styles.scores}>
            <p>
              Первичный балл: {primaryScore} / {maxScore}
            </p>
            <p>Вторичный балл: {secondaryScore}</p>
          </div>
          <Button onClick={handleCreateTest}>Записать</Button>
        </div>
      </div>
    </div>
  );
}
