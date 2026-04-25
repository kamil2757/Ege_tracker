import Button from "../../../../components/Button/Button";
import styles from "./TestsBlock.module.scss";
import ProgressBar from "../../../../components/ProgressBar/ProgressBar";
import CircularProgress from "../../../../components/CircularProgress/CircularProgress";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function TestsBlock({ setIsOpen }) {
  const { subject, createTest } = useSelector((state) => state.subjects);
  useEffect(() => {
    console.log(subject)
  },[subject])

  const lastTest = subject.last_test;
  const otherTests = subject.tests;
  useEffect(() => {
    console.log(otherTests);
  }, [otherTests]);

  useEffect(() => {
    console.log(lastTest);
  }, [lastTest]);

  // if (!subject) {
  //   return <div>Loading...</div>; // или null, или спиннер
  // }

  if (subject?.title && otherTests.length === 0 && !lastTest) {
    return (
      <div className={styles.NoTestsBlock}>
        <div className={styles.wrapper}>
          <p>У вас еще не было пробников</p>
          <Button onClick={() => setIsOpen(true)}>Добавить</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.TestsBlock}>
      <div className={styles.LastTest}>
        <div className={styles.infoLastTest}>
          <div className={styles.section1}>
            <h3>{lastTest.title}</h3>
            <div className={styles.numbers}>
              {lastTest.tasks.map((t) => (
                <span
                  className={`${styles.task} ${t.score == 0 ? styles.failed : ""}`}
                  key={t.number}
                >
                  {t.number}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.section2}>
            <CircularProgress
              value={
                subject.score_conversions[lastTest.score - 1]
                  ?.secondary_score ?? 0
              }
            ></CircularProgress>
          </div>
        </div>

        <Button onClick={() => setIsOpen(true)}>Новый пробник</Button>
      </div>
      <div className={styles.otherTests}>
        {otherTests.slice(0, 4).map((t) => (
          <div className={styles.blockTest} key={t.id}>
            <h3>Пробник</h3>
            <div className={styles.info}>
              <p>{`${subject.score_conversions[t.score - 1]?.secondary_score ?? 0}/100`}</p>
              <ProgressBar
                progress={
                  subject.score_conversions[t.score - 1]?.secondary_score ?? 0
                }
                widthBar="34"
                heightBar="10px"
              ></ProgressBar>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
