import styles from "./ChooseSubjectsPage.module.scss";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjects } from "../../store/subjectsSlice";
import CreateSubject from "../CreateSubject/CreateSubject";

export default function ChooseSubjectsPage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.subjects);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSubjects());
  }, [dispatch]);

  useEffect(() => {
    console.log(items);
  }, [items]);

  if (status === "loading" || status == "error") {
    return null;
  }

  if (status === "succeeded" && items.length === 0) {
    return <Navigate to="/create-subjects" replace />;
  }

  return (
    <div
      className={"container " + styles.ChooseSubjectsPage}
      to="/subjects/math-prof"
    >
      {items.map((subject) => (
        <Link className={styles.subjectsBlock} to={`/subjects/${subject.id}`} key={subject.id}>
          <div className={styles.section1}>
            <h3>{subject.title}</h3>
            <ProgressBar
              progress={subject.average_understanding}
              widthBar="100%"
              heightBar="12px"
            ></ProgressBar>
          </div>
          {subject.last_test ? (
            <div className={styles.section2}>
              <p>Последний пробник</p>
              <p className={styles.scores}>{subject.last_test.score} балл</p>
            </div>
          ) : (
            <div className={`${styles.section2} ${styles.section2_wasnt}`}>
              <p>Пробника еще не было</p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
