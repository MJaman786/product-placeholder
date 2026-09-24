import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/Auth/useAuthStore";

export default function ProtectedRoutes() {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}