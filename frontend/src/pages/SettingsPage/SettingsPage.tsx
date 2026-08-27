import { useEffect, useState } from "react";
import styles from "./SettingsPage.module.scss";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { updateSubjects } from "../../store/subjectsSlice";
import { getSubjects } from "../../store/subjectsSlice";
import { clearAuth, logout } from "../../store/authSlice";
import { clearUpdateStatus } from "../../store/subjectsSlice";
import { Navigate, useNavigate } from "react-router";

const subjects = [
  { value: "math_profile", label: "Математика (профильная)" },
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

export default function SettingsPage() {
  const { items, error, updateStatus } = useSelector((state) => state.subjects);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    volume_subjects: "3",
  });
  const [username, setUsername] = useState("");
  const [subjectsData, setSubjectsData] = useState([
    { subject: "", score: "" },
    { subject: "", score: "" },
    { subject: "", score: "" },
  ]);

  useEffect(() => {
    if (updateStatus === "succeeded") {
      const timer = setTimeout(() => {
        dispatch(clearUpdateStatus());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateStatus, dispatch]);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (items.length == 0) {
       navigate("/create-subjects", { replace: true });
       return
    }
    if (items) {
      setFormData({ volume_subjects: items.length });
      console.log(items);
      setSubjectsData(
        items.map((item) => ({
          subject: subjects.filter((s) => s.label == item.title)[0].value,
          score: item.target_score.toString(),
        })),
      );
    } else {
      dispatch(getSubjects());
    }
  }, [items]);

  function validation(value) {
    if (isNaN(value)) {
      for (const it of subjectsData.values()) {
        if (it.subject == value) {
          return false;
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

    function isCorrect() {
      let newsmth = false;
      for (const item of subjectsData) {
        const label = subjects.filter((x) => x.value == item.subject)[0].label;
        if (
          items.filter(
            (x) => x.title === label && Number(item.score) === x.target_score,
          ).length != 1
        ) {
          newsmth = true;
        }
      }

      return (
        newsmth ||
        user.username != username ||
        items.length != subjectsData.length
      );
    }

    if (!isCorrect()) {
      console.log("Ничего не измнеилось");
      console.log(items, subjectsData);
      return;
    }

    const data = { subjects: subjectsData, username: username };
    console.log(data);
    const resultAction = await dispatch(updateSubjects(data));

    console.log(resultAction);
  };

  function handleLogout() {
    dispatch(logout()).finally(() => {
      dispatch(clearAuth());
    });
  }

  return (
    <div className={"container " + styles.SettingsPage}>
      {error && <div className={styles.ErrorBlock}>{error.detail}</div>}

      {updateStatus == "succeeded" && (
        <div className={styles.SuccesBlock}>Данные успешно изменены</div>
      )}
      <form action="" className={styles.formSettings}>
        <div className={styles.UserData}>
          <h1>Данные</h1>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></Input>

          <p onClick={handleLogout} className={styles.logoutText}>
            Выйти с Аккаунта
          </p>
        </div>
        <div className={styles.UserSubjects}>
          <h1>Предметы</h1>
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
          </div>
        </div>
        <Button onClick={handleSubmit} className={styles.btn_settings}>
          Применить
        </Button>
      </form>
    </div>
  );
}
