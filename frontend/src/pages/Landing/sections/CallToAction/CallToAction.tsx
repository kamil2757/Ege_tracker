import { Link } from "react-router";
import Button from "../../../../components/Button/Button";
import styles from "./CallToAction.module.scss";

export default function CallToAction() {
  return (
    <div className={styles.CallToAction}>
      <div className={"container " + styles.wrapper}>
        {" "}
        <h3>
          Подготовка к ЕГЭ становится эффективнее, когда ты видишь реальную
          картину. Начни отслеживать свой прогресс и управляй подготовкой
          осознанно.
        </h3>
        <Link to={'/auth/login'}>
          <Button> Начать отслеживать прогресс</Button>
        </Link>
      </div>
    </div>
  );
}
