import styles from "./Auth.module.scss";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice";

export default function Login() {
  const [errors, setErrors] = useState([]);
  const { status, error } = useSelector((state) => state.auth);
  const loading = status === "loading";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = [];

    if (formData.username.length < 3) {
      newErrors.push("Имя/эл-почта должно содержать минимум 3 символа");
      console.log("error:", formData);
    }

    if (formData.password.length < 6) {
      newErrors.push("Пароль должен содержать минимум 6 символов");
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const resultAction = await dispatch(login(formData));

    if (login.fulfilled.match(resultAction)) {
      console.log("Вход успешен", resultAction);
      setFormData({
        username: "",
        password: "",
      });

      setErrors([]);
      navigate("/subjects");
    } else {
      console.log(resultAction);
      if (typeof resultAction.payload === "string") {
        setErrors([resultAction.payload]);
      } else {
        setErrors(Object.values(resultAction.payload));
      }
    }
  };

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div className={styles.Login}>
      <h1>Вход</h1>

      {errors.length > 0 && (
        <div className={styles.ErrorBlock}>{errors[0]}</div>
      )}

      <form action="" className={styles.formBlock} onSubmit={handleSubmit}>
        <Input
          type="text"
          name="username"
          placeholder="Ваш ник или эл-почта"
          onChange={handleChange}
          autoComplete="username"
          value={formData.username}
        />
        <Input
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={handleChange}
          autoComplete="password"
          value={formData.password}
        />
        <Button disabled={loading}>{loading ? "Вход..." : "Войти"}</Button>
      </form>
      <p className={styles.miniText}>
        Нет аккаунта? <Link to="/auth/register">Cоздай</Link>
      </p>
    </div>
  );
}
