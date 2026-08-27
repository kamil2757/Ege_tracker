import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const {isAuthenticated, status} = useSelector((state) => state.auth);
  if (status === "idle" || status === "loading") {
    return <div>Загрузка...</div>; // Сюда потом можешь вставить красивый спиннер
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
