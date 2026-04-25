import { Link, useLocation } from "react-router-dom";
import styles from "./Footer.module.scss";

export default function Footer() {
  const location = useLocation()
  return (
    <footer>
      <div className={"container " + styles.footer_wrapper}>
        <div className={styles.info_block}>
          <Link className={styles.logoH1}>ЕТрекер</Link>
          <p className={styles.siteInfo}>
            — сервис для осознанной подготовки к ЕГЭ. Помогает фиксировать
            понимание заданий, отслеживать пробники и видеть прогресс по
            предметам.
          </p>

          <p className={styles.copyright}>
            © 2025 ЕТрекер. Все права защищены.
          </p>
        </div>

        <div className={styles.links_block}>
          <nav className={styles.block} aria-label="социальные сети">
            <div className={styles.link}>
              <a
                href="https://t.me/hzchotytpisat_Dip"
                target="_blank"
                rel="noopener noreferrer"
              >
                Телеграм-канал
              </a>
            </div>
            <div className={styles.link}>
              <a
                href="https://t.me/ia_kamil"
                target="_blank"
                rel="noopener noreferrer"
              >
                Телеграм
              </a>
            </div>
            <div className={styles.link}>
              <a
                href="https://www.youtube.com/@dip2986/videos"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ютуб-канал
              </a>
            </div>
          </nav>

          <nav className={styles.block} aria-label="Навигация по сайту">
            <div className={styles.link}>
              <Link to="/">Главная</Link>
            </div>
            <div className={styles.link}>
              <Link to="/subjects">Предметы / Прогресс</Link>
            </div>
            <div className={styles.link}>
              <Link to="/profile">Профиль</Link> / <Link to="/settings">Настройки</Link>
            </div>
            {/* <div className={styles.link}>
              {location.pathname == '/' && <Link to="/faq">FAQ или «Как это работает»</Link> }
            </div> */}
          </nav>
        </div>
      </div>
    </footer>
  );
}
