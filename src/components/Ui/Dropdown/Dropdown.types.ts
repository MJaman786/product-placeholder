// ── Option shape ──────────────────────────────────────────────────────────────
export interface DropdownOption {
  label: string;
  value: string;
}

// ── Component props ───────────────────────────────────────────────────────────
export interface DropdownProps {
  /** Array of selectable options */
  options: DropdownOption[];

  /** Controlled selected value(s). Pass string[] for multiSelect, string for single. */
  value?: string | string[];

  /** Fires with updated value(s) whenever selection changes */
  onChange?: (value: string | string[]) => void;

  /** Placeholder shown when nothing is selected */
  placeholder?: string;

  /** Enable multi-select mode */
  multiSelect?: boolean;

  /**
   * Auto-selects the first option on mount.
   * Ignored when noAutoSelect is true.
   */
  autoSelect?: boolean;

  /** Explicitly prevents auto-selection even if autoSelect is true */
  noAutoSelect?: boolean;

  /** Disables the entire dropdown */
  disabled?: boolean;

  /** Shows a spinner and disables interaction */
  loading?: boolean;

  /** Displays an error message below the trigger */
  error?: string;

  /** Extra Tailwind classes applied to the trigger element */
  className?: string;
}

// ── Hook params ───────────────────────────────────────────────────────────────
export interface UseDropdownParams {
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiSelect: boolean;
  autoSelect: boolean;
  noAutoSelect: boolean;
}
