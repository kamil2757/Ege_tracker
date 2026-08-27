import styles from "./ForWhat.module.scss";
import forwhat from "@/assets/images/forwhat.svg";

export default function ForWhat() {
  return (
    <div className={styles.ForWhat}>
      <div className={"container " + styles.information}>
        <img src={forwhat} alt="лист дел на день" />
        <div className={styles.info}>
          <p>
            Сайт позволяет фиксировать понимание заданий в процентах, записывать
            результаты пробников и видеть реальный прогресс по каждому предмету.
            Сервис помогает выявлять слабые места, контролировать рост
            результатов и системно двигаться к своей цели по баллам.
          </p>
          <p className={styles.miniText}>
            ничего не нужно считать вручную, автоматическая аналитика, наглядный
            рост прогресса!
          </p>
        </div>
      </div>
    </div>
  );
}
