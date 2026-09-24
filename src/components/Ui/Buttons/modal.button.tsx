interface ButtonProps {
  label: string;
  loadingLabel?: string;
  varient?: "submit" | "cancel" | "clear" | "ghost";
  variant?: "submit" | "cancel" | "clear" | "ghost"; // Alias for compatibility
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  label,
  loadingLabel,
  varient = "submit",
  variant,
  type = "button",
  isLoading = false,
  onClick,
  className = "",
  disabled = false,
}: ButtonProps) {
  const activeVariant = variant || varient;

  const buttonVariant = {
    // Primary CTA: Luminous contrast in light and dark mode using tokens
    submit:
      "bg-primary hover:bg-primary-active text-on-primary border-transparent shadow-card-soft hover:shadow-card-hover focus-visible:ring-primary/40",

    // Destructive semantic action
    cancel:
      "bg-error/10 hover:bg-error/20 text-error border-error/20 hover:border-error/30 focus-visible:ring-error/40",

    // Secondary surface action: Surface card with hairline border
    clear:
      "bg-surface-card hover:bg-canvas-soft/80 dark:hover:bg-surface-strong text-body hover:text-ink border-hairline-strong hover:border-ink shadow-card-soft focus-visible:ring-ink/20",

    // Ghost style
    ghost:
      "bg-transparent hover:bg-surface-strong/30 dark:hover:bg-surface-strong text-body hover:text-ink border-transparent focus-visible:ring-primary/30",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative inline-flex items-center justify-center gap-2 h-10 px-4.5 py-2.5 rounded-md border
        font-sans font-medium text-sm transition-all duration-150 select-none
        active:scale-[0.98] cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none
        ${buttonVariant[activeVariant]}
        ${className}
      `}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className="tracking-tight">{isLoading ? loadingLabel : label}</span>
    </button>
  );
}