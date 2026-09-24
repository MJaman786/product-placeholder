import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  LogOut,
  Sun,
  Moon,
  Package,
  PlusCircle,
} from "lucide-react";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import { useThemeStore } from "../../store/Theme/useThemeStore";

interface NavbarProps {
  title?: string;
  onMenuToggle?: () => void;
  onAddProductClick?: () => void;
}

export default function Navbar({
  title,
  onMenuToggle,
  onAddProductClick,
}: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoggedIn } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    if (title) return title;
    const path = location.pathname.replace(/^\//, "");
    if (!path || path === "products") return "Products Catalog";
    if (path.startsWith("products/")) return "Product Details";
    if (path === "categories") return "Categories";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const isAuthPage = location.pathname === "/login";

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-canvas/85 backdrop-blur-md border-b border-hairline px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors font-sans py-8">
      {/* Left: Mobile hamburger & Active Context / Logo */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-muted hover:text-ink hover:bg-surface-strong/60 border border-transparent hover:border-hairline transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            aria-label="Toggle navigation"
          >
            <Menu size={18} />
          </button>
        )}

        {isAuthPage ? (
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0 shadow-card-soft">
              <Package size={18} className="text-on-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-ink tracking-tight leading-tight">
                Product Hub
              </span>
              <span className="font-mono text-[9px] text-muted tracking-wider uppercase">
                Admin Console
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink text-sm sm:text-base tracking-tight">
              {getPageTitle()}
            </span>
          </div>
        )}
      </div>

      {/* Right: Add Product CTA, Theme Toggle, User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Quick Add Product CTA */}
        {isLoggedIn && onAddProductClick && (
          <button
            type="button"
            onClick={onAddProductClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary hover:bg-primary-active text-on-primary text-xs font-medium shadow-card-soft transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <PlusCircle size={14} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-md bg-surface-card text-muted hover:text-ink hover:bg-canvas-soft/80 dark:hover:bg-surface-strong/60 border border-hairline hover:border-hairline-strong transition-all flex items-center justify-center cursor-pointer shadow-card-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Moon size={15} className="text-primary" />
          ) : (
            <Sun size={15} className="text-amber-500" />
          )}
        </button>

        {/* User Account / Profile Dropdown */}
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 pl-2.5 rounded-md bg-surface-card hover:bg-canvas-soft/80 dark:hover:bg-surface-strong/60 transition-all border border-hairline hover:border-hairline-strong shadow-card-soft cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <span className="text-xs font-medium text-ink hidden md:inline truncate max-w-[120px]">
                {user?.username || "emilys"}
              </span>
              <div className="w-7 h-7 rounded-md bg-primary/10 text-primary dark:bg-surface-strong dark:text-ink font-mono font-semibold flex items-center justify-center text-xs uppercase border border-hairline">
                {user?.username?.[0] || "E"}
              </div>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-hairline-strong rounded-lg shadow-card-hover p-1.5 text-sm z-50 animate-fadeIn font-sans">
                <div className="px-3 py-2 border-b border-hairline">
                  <p className="font-semibold text-ink truncate text-xs">
                    {user?.firstName ? `${user.firstName} ${user.lastName}` : "Emily Johnson"}
                  </p>
                  <p className="font-mono text-[10.5px] text-muted truncate">
                    @{user?.username || "emilys"}
                  </p>
                  <span className="inline-block font-mono text-[9px] mt-1.5 px-1.5 py-0.5 rounded-xs bg-canvas-soft text-body border border-hairline uppercase tracking-wider">
                    Role: Product Admin
                  </span>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-error hover:bg-error/10 transition-colors cursor-pointer font-medium"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-md bg-primary hover:bg-primary-active text-on-primary text-xs font-medium transition-all shadow-card-soft"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}