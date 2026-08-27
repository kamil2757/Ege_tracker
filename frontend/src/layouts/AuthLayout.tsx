import styles from "./AuthLayout.module.scss";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className={styles.AuthLayout}>
      <div className={styles.BlockAuth}>
        <Outlet />
      </div>
    </div>
  );
}
