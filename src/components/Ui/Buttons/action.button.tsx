import React from "react";

interface ActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "default" | "danger" | "success" | "ghost";
  title?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export default function ActionButton({
  icon,
  label,
  onClick,
  variant = "default",
  title,
  disabled = false,
  className = "",
  size = "md",
}: ActionButtonProps) {
  const variantStyles = {
    default:
      "bg-surface-card hover:bg-canvas-soft/80 dark:hover:bg-surface-strong text-body hover:text-ink border-hairline hover:border-hairline-strong shadow-card-soft",
    danger:
      "bg-transparent hover:bg-error/10 text-muted hover:text-error border-transparent hover:border-error/25",
    success:
      "bg-transparent hover:bg-success/10 text-muted hover:text-success border-transparent hover:border-success/25",
    ghost:
      "bg-transparent hover:bg-surface-strong/30 dark:hover:bg-surface-strong text-muted hover:text-ink border-transparent",
  };

  const sizeStyles = {
    sm: "p-1 text-[11px] rounded-xs gap-1",
    md: "px-2 py-1.5 text-xs rounded-md gap-1.5",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        inline-flex items-center justify-center font-sans font-medium border
        transition-all duration-150 cursor-pointer select-none
        active:scale-[0.97]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <span className="shrink-0 flex items-center justify-center">{icon}</span>
      {label && <span className="tracking-tight">{label}</span>}
    </button>
  );
}