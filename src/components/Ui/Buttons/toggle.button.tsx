interface ToggleBtnTypes {
  value: boolean;
  handleToggle: () => void;
  name?: string;
  disabled?: boolean;
  className?: string;
}

export default function ToggleBtn({
  value,
  handleToggle,
  name,
  disabled = false,
  className = "",
}: ToggleBtnTypes) {
  return (
    <label
      className={`relative inline-flex items-center select-none ${
        disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
      } ${className}`}
    >
      <input
        type="checkbox"
        name={name}
        className="sr-only peer"
        checked={value}
        onChange={handleToggle}
        disabled={disabled}
      />
      <div
        className="
          w-10 h-6 rounded-pill transition-colors duration-150 border
          bg-hairline dark:bg-canvas-soft border-hairline-strong
          peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas
          peer-checked:bg-primary peer-checked:border-primary
          after:content-[''] after:absolute after:top-[2px] after:start-[2px]
          after:h-5 after:w-5 after:rounded-pill after:transition-all after:duration-150
          after:bg-surface-card dark:after:bg-ink after:shadow-sm
          peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-4
          peer-checked:after:bg-on-primary
        "
      />
    </label>
  );
}