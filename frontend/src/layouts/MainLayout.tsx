import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from './MainLayout.module.scss'
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/authSlice";

export default function MainLayout() {
  const dispatch = useDispatch()
  const {status, isAuthenticated} = useSelector((state) => state.auth)
  
  useEffect(() => {
    if (status == 'idle'){
      dispatch(checkAuth())
    }
  }, [dispatch, status])

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.content}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
