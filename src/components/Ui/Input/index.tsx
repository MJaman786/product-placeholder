import React, { useState } from "react";
import { Eye, EyeClosed, AlertCircle } from "lucide-react";

interface InputFieldProps {
  label?: string;
  icon?: React.ReactNode;
  type?: "text" | "email" | "password" | "number" | "checkbox";
  name: string;
  placeholder?: string;
  inputClass?: string;
  iconClass?: string;
  value?: string | number;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  touched?: boolean;
  error?: string;
  disabled?: boolean;
}

export default function InputField({
  label,
  icon,
  type = "text",
  name,
  placeholder,
  inputClass = "",
  iconClass = "",
  value,
  checked,
  onChange,
  onBlur,
  touched,
  error,
  disabled = false,
}: InputFieldProps) {
  const showError = Boolean(touched && error);
  const [isPasswordHidden, setPasswordHidden] = useState<boolean>(true);

  const effectiveType =
    type === "password" ? (isPasswordHidden ? "password" : "text") : type;

  // Checkbox Variant
  if (type === "checkbox") {
    return (
      <div className="flex items-center gap-2.5 select-none font-sans">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className="w-4 h-4 rounded-xs border-hairline-strong bg-surface-card accent-primary text-on-primary 
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 focus:ring-offset-canvas 
          transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {label && (
          <label
            htmlFor={name}
            className={`text-xs font-medium text-body transition-colors cursor-pointer ${
              disabled ? "opacity-50 cursor-not-allowed" : "hover:text-ink"
            }`}
          >
            {label}
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5 font-sans">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-medium text-body uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      {/* Input Element Container */}
      <div className="relative group">
        {/* Leading Icon */}
        {icon && (
          <div
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors pointer-events-none ${iconClass}`}
          >
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          id={name}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full h-11 bg-surface-card border text-sm text-ink placeholder:text-muted rounded-md 
            transition-all duration-150 outline-none
            ${icon ? "pl-10" : "pl-3.5"} 
            ${type === "password" ? "pr-10" : "pr-3.5"}
            ${
              showError
                ? "border-error focus:border-error focus:ring-2 focus:ring-error/20 focus:shadow-sm"
                : "border-hairline-strong hover:border-primary/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:shadow-sm"
            }
            disabled:opacity-50 disabled:bg-canvas-soft/40 disabled:cursor-not-allowed disabled:hover:border-hairline-strong
            ${inputClass}
          `}
        />

        {/* Password Visibility Toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setPasswordHidden((prev) => !prev)}
            aria-label={isPasswordHidden ? "Show password" : "Hide password"}
            disabled={disabled}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors cursor-pointer disabled:pointer-events-none ${iconClass}`}
          >
            {isPasswordHidden ? <EyeClosed size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {/* Validation Error */}
      {showError && (
        <p className="flex items-center gap-1.5 text-xs text-error font-medium animate-fadeIn">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}