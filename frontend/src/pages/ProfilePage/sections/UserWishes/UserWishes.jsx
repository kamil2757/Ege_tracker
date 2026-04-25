import { useSelector } from "react-redux";
import styles from "./UserWishes.module.scss";
import { use, useEffect } from "react";

export default function UserWishes() {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(user)
  }, [user])
  return (
    <div className={styles.UserWishes}>
      <p>{user.motivation_text ?? 'Я обязательно сдам все на 100 баллов!'}</p>
    </div>
  );
}
