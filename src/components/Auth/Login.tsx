import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  Package,
  Lock,
  User,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import InputField from "../../components/Ui/Input";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import { useThemeStore } from "../../store/Theme/useThemeStore";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: (values) => {
      const errors: Partial<LoginFormValues> = {};

      if (!values.username.trim()) {
        errors.username = "Username is required";
      } else if (values.username.trim().length < 3) {
        errors.username = "Username must be at least 3 characters";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 4) {
        errors.password = "Password must be at least 4 characters";
      }

      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {
      // Mock session set directly without backend dependency
      const mockUser = {
        id: 1,
        username: values.username.trim(),
        email: `${values.username.trim().toLowerCase()}@example.com`,
        firstName: "Emily",
        lastName: "Johnson",
        gender: "female",
        role: "ADMIN",
        image: "https://dummyjson.com/icon/emilys/128",
      };

      const mockAccessToken = `mock_jwt_token_${Date.now()}`;

      // Persist auth credentials to the auth store
      login(mockUser as any, mockAccessToken);

      setSubmitting(false);

      // Redirect directly to the dashboard
      navigate("/dashboard");
    },
  });

  const handleFillDemo = () => {
    formik.setValues({
      username: "emilys",
      password: "emilyspass",
    });
    formik.setTouched({});
  };

  return (
    <div className="relative min-h-screen w-full bg-canvas flex flex-col justify-between items-center p-4 sm:p-6 overflow-hidden font-sans">
      {/* Soft Ambient Wash */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[360px] hero-atmospheric-wash" />

      {/* Top Header */}
      <header className="w-full max-w-5xl flex justify-between items-center z-10 py-2">
        <div className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shadow-card-soft">
            <Package size={18} className="text-on-primary" />
          </div>
          <span className="font-semibold text-sm text-ink tracking-tight">
            Product Hub
          </span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-md bg-surface-card border border-hairline hover:border-hairline-strong text-muted hover:text-ink flex items-center justify-center transition-all shadow-card-soft cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Moon size={15} className="text-primary" />
          ) : (
            <Sun size={15} className="text-amber-500" />
          )}
        </button>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-[420px] z-10 my-auto">
        <div className="bg-surface-card border border-hairline rounded-xl p-6 sm:p-8 shadow-card-soft space-y-6">
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-bold text-ink tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-muted">
              Enter your credentials to access the admin dashboard.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
            {/* Reusable InputField for Username */}
            <InputField
              label="Username"
              name="username"
              type="text"
              placeholder="e.g. emilys"
              icon={<User size={15} />}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.username}
              error={formik.errors.username}
              disabled={formik.isSubmitting}
            />

            {/* Reusable InputField for Password (auto-handles eye visibility toggle) */}
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={15} />}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.password}
              error={formik.errors.password}
              disabled={formik.isSubmitting}
            />

            {/* Submit Action */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full h-11 mt-2 rounded-md bg-primary hover:bg-primary-active text-on-primary text-sm font-medium transition-all shadow-card-soft hover:shadow-card-hover flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              {formik.isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-pill border-2 border-current border-t-transparent animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Test Credentials Helper */}
          <div className="pt-4 border-t border-hairline space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
                Test Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:text-primary-active transition-colors cursor-pointer"
              >
                <Sparkles size={12} />
                <span>Auto-fill demo</span>
              </button>
            </div>

            <div className="p-2.5 rounded-md bg-canvas-soft border border-hairline text-xs font-mono space-y-1">
              <div className="flex justify-between text-body">
                <span className="text-muted">Username:</span>
                <span className="text-ink font-semibold">emilys</span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-muted">Password:</span>
                <span className="text-ink font-semibold">emilyspass</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full text-center text-xs font-mono text-muted py-3 z-10">
        Product Admin Dashboard &bull; DummyJSON API
      </footer>
    </div>
  );
}