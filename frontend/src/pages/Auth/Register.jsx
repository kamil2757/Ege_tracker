import styles from "./Auth.module.scss";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const loading = status === "loading";
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const resultAction = await dispatch(register(formData));

    if (register.fulfilled.match(resultAction)) {
      console.log("Регистрация успешна", resultAction);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/create-subjects");

      setErrors([]);
    } else {
      console.log(resultAction.payload);
      setErrors(Object.values(resultAction.payload));
    }
  };

  const validateForm = () => {
    const newErrors = [];

    if (formData.username.length < 3) {
      newErrors.push("Имя должно содержать минимум 3 символа");
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push("Email введен некорректно");
    }

    if (formData.password.length < 6) {
      newErrors.push("Пароль должен содержать минимум 6 символов");
    }

    return newErrors;
  };

  return (
    <div className={styles.Register}>
      <h1>Регистрация</h1>

      {errors.length > 0 && (
        <div className={styles.ErrorBlock}>{errors[0]}</div>
      )}

      <form action="" className={styles.formBlock} onSubmit={handleSubmit}>
        <Input
          type="text"
          name="username"
          placeholder={"Ваш ник"}
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />
        <Input
          type="email"
          name="email"
          placeholder={"Эл-почта"}
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <Input
          type="password"
          name="password"
          placeholder={"Пароль"}
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <Button disabled={loading}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>
      <p className={styles.miniText}>
        Есть аккаунт? <Link to="/auth/login">Войди</Link>
      </p>
    </div>
  );
}
