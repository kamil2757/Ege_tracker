import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import styles from "./CreateSubject.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { createSubjects } from "../../store/subjectsSlice";
import { useNavigate } from "react-router";

const subjects = [
  { value: "math_profile", label: "Математика (профиль)" },
  { value: "russian", label: "Русский язык" },
  { value: "physics", label: "Физика" },
  { value: "chemistry", label: "Химия" },
  { value: "informatics", label: "Информатика и ИКТ" },
  { value: "biology", label: "Биология" },
  { value: "history", label: "История" },
  { value: "geography", label: "География" },
  { value: "social_studies", label: "Обществознание" },
  { value: "literature", label: "Литература" },
  { value: "english", label: "Английский язык" },
];

export default function CreateSubject() {
  const dispatch = useDispatch();
  const { error, createStatus } = useSelector((state) => state.subjects);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    volume_subjects: "3",
    user_message: "",
  });

  const [subjectsData, setSubjectsData] = useState([
    { subject: "", score: "" },
    { subject: "", score: "" },
    { subject: "", score: "" },
  ]);

  function validation(value) {
    if (isNaN(value)) {
      for (const it of subjectsData.values()){
        if (it.subject == value){
          return false
        }
      }
    } else {
      value = Number(value);
      if (value > 100) {
        return false;
      }
    }

    return true;
  }

  function handleSubjectChange(index, field, value) {
    if (validation(value)) {
      setSubjectsData((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      );
    }
  }

  useEffect(() => {
    if (createStatus == "succeeded") {

      navigate("/subjects");
    }
  }, [createStatus]);

  function getCorrectValue(count) {
    if (count < 1 || count >= 15) return 3;
    return count;
  }

  function handleChangeVolumeSubjects(e) {
    const value = Number(e.target.value);
    const count = getCorrectValue(value);

    setFormData((prev) => ({
      ...prev,
      volume_subjects: value > 0 ? value : "",
    }));

    setSubjectsData((prev) => {
      const newArr = [...prev];

      if (count > newArr.length) {
        while (newArr.length < count) {
          newArr.push({ subject: "", score: "" });
        }
      }

      if (count < newArr.length) {
        newArr.length = count;
      }

      return newArr;
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(
      createSubjects({ subjects: subjectsData }),
    );

    console.log(resultAction);
  };

  return (
    <div className={styles.CreateSubject}>
      <div className={styles.blockContent}>
        <h1>Создание предметов</h1>
        {error && <div className={styles.ErrorBlock}>{error.detail}</div>}
        <p>
          Выбери предметы, которые ты будешь сдавать, и задай цель по баллам.
        </p>
        <form action="" className={styles.FormCreate} onSubmit={handleSubmit}>
          <div className={styles.InputsBlock}>
            <Input
              placeholder="Кол-во предметов"
              onChange={handleChangeVolumeSubjects}
              value={formData.volume_subjects}
              name="volume_subjects"
              type="number"
            />
            {subjectsData.map((item, index) => (
              <div className={styles.subjInp} key={index}>
                <Select
                  options={subjects}
                  onChange={(e) =>
                    handleSubjectChange(index, "subject", e.target.value)
                  }
                  value={item.subject || ""}
                />
                <Input
                  placeholder="цель по баллам"
                  type="number"
                  value={item.score}
                  onChange={(e) =>
                    handleSubjectChange(index, "score", e.target.value)
                  }
                ></Input>
              </div>
            ))}
            <div className={styles.sumScores}>
              Ваша цель{" "}
              {subjectsData.reduce(
                (acc, d) => Number(acc) + Number(d["score"]),
                0,
              )}{" "}
              баллов
            </div>
            {/* <Input
              placeholder="Послание себе в профиль"
              onChange={handleChange}
              value={formData.user_message}
              name="user_message"
            /> */}
          </div>
          <div className={styles.btn_block}>
            <Button>Готово</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
