import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing/Landing";
import ChooseSubjectsPage from "./pages/ChooseSubjectsPage/ChooseSubjectsPage";
import SubjectPage from "./pages/SubjectPage/SubjectPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CreateSubject from "./pages/CreateSubject/CreateSubject";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import SettingsPage from "./pages/SettingsPage/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/create-subjects" element={<CreateSubject />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/subjects">
              <Route index element={<ChooseSubjectsPage />} />
              <Route path=":subjectId" element={<SubjectPage />} />
            </Route>

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route element={<PublicRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<Navigate to="login" replace />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
