import { useParams } from "react-router";
import styles from "./SubjectPage.module.scss";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import HeaderSubject from "./sections/HeaderSubject/HeaderSubject";
import TestsBlock from "./sections/TestsBlock/TestsBlock";
import MainTasks from "./sections/MainTasks/MainTasks";
import Modal from "../../components/Modal/Modal";
import CreateTestModal from "./sections/CreateTestModal/CreateTestModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubject } from "../../store/subjectsSlice";

export default function SubjectsPage() {
  const { subjectId } = useParams();
  const { subjectStatus, subject } = useSelector((state) => state.subjects);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSubject(subjectId));
  }, [dispatch]);

  if (!subject || subjectStatus == 'loading') {
    return <div>Loading...</div>; // или null, или спиннер
  }

  return (
    <div className={"container " + styles.SubjectPage}>
      <HeaderSubject />
      <MainTasks />
      <TestsBlock setIsOpen={setIsOpen}></TestsBlock>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreateTestModal onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
}
