import styles from "./Ideas.module.scss";
import ideas from "@/assets/images/Ideas.svg";

export default function Ideas() {
  return (
    <div className={styles.Ideas}>
      <div className={'container ' + styles.ideasWrapper}>
        <div className={styles.HeaderInfo}>
          <h1>Ключевые Идеи ЕТрекера</h1>
          <img src={ideas} alt="Идеи" />
        </div>
        <div className={styles.ideasBlock}>
          <div className={styles.idea}>
            <h2>Контроль</h2>
            <p>
              Ты видишь реальное состояние своей подготовки: уровень понимания
              заданий, результаты пробников и текущие слабые места — без догадок
              и самообмана.
            </p>
          </div>
          <div className={styles.idea}>
            <h2>Структура</h2>
            <p>
              Вся информация о подготовке собрана и упорядочена: предметы,
              задания, пробники и комментарии — ничего не теряется и не держится
              в голове.
            </p>
          </div>
          <div className={styles.idea}>
            <h2>Прогресс</h2>
            <p>
              Рост измеряется в цифрах и графиках: ты видишь, как меняются
              проценты и баллы со временем, и понимаешь, что твои усилия дают
              результат.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
