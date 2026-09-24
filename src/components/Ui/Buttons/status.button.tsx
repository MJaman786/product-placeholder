interface StatusButtonTypes {
  label: string;
  variant: string;
  onClick: (val: string) => void;
  currentStatus: string;
  className?: string;
  disabled?: boolean;
}

export default function StatusButton({
  label,
  variant = "",
  onClick,
  currentStatus = "",
  className = "",
  disabled = false,
}: StatusButtonTypes) {
  const isActive = variant === currentStatus;

  return (
    <button
      type="button"
      onClick={() => onClick?.(variant)}
      disabled={disabled}
      className={`
        font-sans text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-pill border 
        transition-all duration-150 cursor-pointer flex items-center justify-center select-none
        active:scale-[0.97]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        ${
          isActive
            ? "bg-primary text-on-primary border-primary shadow-card-soft"
            : "bg-surface-card hover:bg-canvas-soft/80 dark:hover:bg-surface-strong text-body hover:text-ink border-hairline-strong hover:border-ink/50"
        }
        ${className}
      `}
    >
      {label}
    </button>
  );
}