import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Header() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    console.log(location.pathname);
  }, []);

  return (
    <header>
      <div className={"container " + styles.header_wrapper}>
        <Link className={styles.logoH1} to="/">
          ЕТрекер
        </Link>
        <nav className={styles.nav}>
          <Link
            to={"/subjects"}
            className={
              location.pathname == "/subjects" ? styles.subjects_active : ""
            }
          >
            Предметы
          </Link>
        </nav>
        <Link
          to="/profile"
          className={`${styles.profile} ${location.pathname == "/profile" ? styles.profile_active : ""}`}
        >
          {user.username}
        </Link>
      </div>
    </header>
  );
}
