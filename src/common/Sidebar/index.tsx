import React from "react";
import {
  Package,
  LogOut,
  X,
  Sun,
  Moon,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import { useThemeStore } from "../../store/Theme/useThemeStore";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminNavItems: MenuItem[] = [
  { label: "Products Catalog", icon: <Package size={16} />, path: "/products" },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }: SidebarProps) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleItemClick = (path: string) => { navigate(path); onClose(); };
  const handleLogout    = () => { logout(); navigate("/login"); };

  const initials = user?.firstName?.[0] && user?.lastName?.[0]
    ? `${user.firstName[0]}${user.lastName[0]}`
    : (user?.username?.[0] ?? "E").toUpperCase();

  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "Emily Johnson";

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-canvas-soft border-r border-hairline
        h-screen flex flex-col shrink-0
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* ── Brand Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-card-soft group-hover:scale-105 transition-transform duration-150">
            <Package size={18} className="text-on-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm text-ink tracking-tight leading-tight">Product Hub</p>
            <p className="text-[9px] font-mono text-muted tracking-widest uppercase">Admin Console</p>
          </div>
        </button>

        {/* Mobile close */}
        <button
          type="button"
          className="lg:hidden text-muted hover:text-ink p-1.5 rounded-lg hover:bg-surface-strong transition-colors cursor-pointer"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={17} />
        </button>
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar space-y-0.5">
        <p className="text-[9.5px] font-mono font-semibold tracking-widest text-muted uppercase px-3 mb-2.5">
          Catalog
        </p>

        {AdminNavItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/products" && location.pathname === "/");

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleItemClick(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                isActive
                  ? "bg-primary text-on-primary shadow-card-soft"
                  : "text-body hover:bg-surface-strong hover:text-ink"
              }`}
            >
              <span className={isActive ? "text-on-primary" : "text-muted"}>{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-on-primary/60" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="px-3 pb-4 space-y-2 border-t border-hairline pt-3">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-body hover:bg-surface-strong hover:text-ink text-sm transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            {theme === "dark"
              ? <Moon size={15} className="text-primary" />
              : <Sun size={15} className="text-amber-500" />}
            <span className="font-medium text-sm capitalize">{theme} Mode</span>
          </div>
          <span className="text-[9px] font-mono text-muted bg-surface-strong px-2 py-0.5 rounded-md border border-hairline uppercase tracking-wider">
            Switch
          </span>
        </button>

        {/* User card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-card border border-hairline shadow-card-soft">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary font-mono font-bold flex items-center justify-center text-xs shrink-0 shadow-card-soft">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-xs text-ink truncate leading-tight">{fullName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck size={9} className="text-primary shrink-0" />
                <p className="font-mono text-[9.5px] text-muted truncate">Admin</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}