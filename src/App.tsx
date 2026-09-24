import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppRoutes } from "./routes/index";
import ProtectedRoutes from "./common/ProtectedRoute";
import DynamicRoleLayout from "./common/AppLayout/DynamicRoleLayout";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function App() {
  return (
    <BrowserRouter>
      <SkeletonTheme baseColor="#e4e4e7" highlightColor="#f4f4f5" direction="ltr">
        <Routes>
          {/* Public Routes */}
          {AppRoutes.filter((route) => !route.isPrivate).map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            {AppRoutes.filter((route) => route.isPrivate).map((route) => (
              <Route
                key={route.path}
                element={<DynamicRoleLayout activePage={route.activePage || "Dashboard"} />}
              >
                <Route path={route.path} element={route.element} />
              </Route>
            ))}
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/products" replace />} />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-canvas flex flex-col items-center justify-center gap-4 font-sans">
                <h1 className="text-4xl font-bold text-ink">404</h1>
                <p className="text-muted text-sm">Page not found.</p>
                <a href="/products" className="text-primary text-sm font-medium hover:text-primary-active transition-colors">
                  ← Back to Products
                </a>
              </div>
            }
          />
        </Routes>
      </SkeletonTheme>
    </BrowserRouter>
  );
}