import styles from "./HeaderSubject.module.scss";
import ProgressBar from "../../../../components/ProgressBar/ProgressBar";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function HeaderSubject() {
  const { subject, status } = useSelector((state) => state.subjects);

  // if (!subject) {
  //   return <div>Loading...</div>; // или null, или спиннер
  // }

  return (
    <div className={styles.HeaderSubject}>
      <div className={styles.section1}>
        <h2>{subject.title}</h2>
        <ProgressBar
          progress={subject.average_understanding}
          heightBar="14px"
          widthBar="100%"
        />
      </div>
      <div className={styles.section2}>
        <p>{Math.floor(subject.average_understanding)}%</p>
      </div>
    </div>
  );
}
