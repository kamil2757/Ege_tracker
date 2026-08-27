import { Link } from "react-router";
import Button from "../../../../components/Button/Button";
import styles from "./Hero.module.scss";
import heroImg from "@/assets/images/hero_big.svg";

export default function Hero() {
  return (
    <div className={styles.Hero}>
      <div className={styles.Info_block}>
        <h1 className={styles.info_h1}>
          ЕТрекер — твой трекер подготовки к ЕГЭ
        </h1>
        <p className={styles.info_p}>
          персональный помощник в учебе. Следи за прогрессом,
          ставь цели и достигай их шаг за шагом. Организация подготовки к ЕГЭ
          ещё никогда не была такой простой и наглядной
        </p>
        <Link to={"/auth/login"}>
          <Button>Начать</Button>
        </Link>
      </div>
      <div className={styles.Img_block}>
        <img src={heroImg} alt="человек учится" />
      </div>
    </div>
  );
}
