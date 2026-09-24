import { useEffect, useRef, useCallback, type KeyboardEvent } from "react";
import {
  ChevronDown,
  X,
  Search,
  Check,
  AlertCircle,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";
import { useDropdown } from "./useDropdown";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiSelect?: boolean;
  autoSelect?: boolean;
  noAutoSelect?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  touched?: boolean;
  className?: string;
  width?: string | number;
  height?: string | number;
  panelMaxHeight?: string | number;
}

export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  multiSelect = false,
  autoSelect = false,
  noAutoSelect = false,
  disabled = false,
  loading = false,
  error,
  touched,
  className = "",
  width,
  height,
  panelMaxHeight = "280px",
}: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const showError = Boolean(touched && error);

  const {
    isOpen,
    searchQuery,
    filteredOptions,
    activeIndex,
    selectedValues,
    setIsOpen,
    setSearchQuery,
    setActiveIndex,
    handleSelect,
    handleClearAll,
    handleSelectAll,
    isSelected,
    allSelected,
  } = useDropdown({
    options,
    value,
    onChange,
    multiSelect,
    autoSelect,
    noAutoSelect,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen, setSearchQuery]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled || loading) return;

      switch (e.key) {
        case "Enter":
        case " ":
          if (isOpen && (e.target as HTMLElement).tagName === "INPUT") return;
          if (!isOpen) {
            setIsOpen(true);
          } else if (activeIndex >= 0 && filteredOptions[activeIndex]) {
            handleSelect(filteredOptions[activeIndex]);
          }
          e.preventDefault();
          break;
        case "ArrowDown":
          if (!isOpen) setIsOpen(true);
          setActiveIndex((prev) =>
            Math.min(prev + 1, filteredOptions.length - 1)
          );
          e.preventDefault();
          break;
        case "ArrowUp":
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          e.preventDefault();
          break;
        case "Escape":
          setIsOpen(false);
          setSearchQuery("");
          e.preventDefault();
          break;
      }
    },
    [disabled, loading, isOpen, activeIndex, filteredOptions, handleSelect, setIsOpen, setActiveIndex, setSearchQuery]
  );

  const renderTriggerContent = () => {
    if (loading) {
      return (
        <span className="flex items-center gap-2 text-muted">
          <Loader2 size={14} className="animate-spin text-ink" />
          <span className="text-xs uppercase tracking-wide">Loading…</span>
        </span>
      );
    }

    if (selectedValues.length === 0) {
      if (isOpen) return null;
      return <span className="text-muted">{placeholder}</span>;
    }

    if (multiSelect) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 bg-surface-strong/80 border border-hairline-strong text-ink text-xs font-mono px-2 py-0.5 rounded-sm"
              >
                {opt?.label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(opt!);
                  }}
                  className="hover:text-ink transition-colors ml-0.5"
                >
                  <X size={11} strokeWidth={2} />
                </button>
              </span>
            );
          })}
        </div>
      );
    }

    const selected = options.find((o) => o.value === selectedValues[0]);
    return <span className="text-ink font-medium truncate">{selected?.label || placeholder}</span>;
  };

  const triggerBase = [
    "relative w-full flex items-center justify-between",
    "px-3.5 py-2.5 rounded-md",
    "border text-sm font-sans",
    "transition-all duration-150 cursor-pointer select-none",
    disabled || loading
      ? "bg-canvas-soft/40 border-hairline text-muted cursor-not-allowed opacity-60"
      : showError
      ? "bg-surface-card border-error ring-2 ring-error/20 shadow-sm"
      : isOpen
      ? "bg-surface-card border-primary/50 ring-2 ring-primary/15 shadow-sm"
      : "bg-surface-card border-hairline-strong hover:border-primary/40 shadow-card-soft",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-1.5 font-sans"
      style={{ width: width || "100%" }}
      onKeyDown={handleKeyDown}
      tabIndex={disabled || loading ? -1 : 0}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-disabled={disabled}
    >
      {label && (
        <label className="text-xs font-medium text-body uppercase tracking-wider">
          {label}
        </label>
      )}

      <div
        className={triggerBase}
        style={{ minHeight: height || "44px" }}
        onClick={() => {
          if (!disabled && !loading) setIsOpen((prev) => !prev);
        }}
      >
        <div className="flex-1 min-w-0 pr-2 flex flex-wrap items-center gap-2">
          {renderTriggerContent()}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedValues.length > 0 && !disabled && !loading && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="p-1 rounded-sm text-muted hover:text-ink hover:bg-surface-strong/60 transition-colors"
              aria-label="Clear selection"
            >
              <X size={13} strokeWidth={2} />
            </button>
          )}
          <ChevronDown
            size={15}
            strokeWidth={2}
            className={`text-body transition-transform duration-150 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {showError && (
        <p className="mt-0.5 flex items-center gap-1.5 text-error text-xs font-medium animate-fadeIn">
          <AlertCircle size={12} />
          {error}
        </p>
      )}

      {isOpen && (
        <div
          className="absolute z-50 min-w-full w-max max-w-[95vw] top-[100%] mt-1.5 bg-surface-card border border-hairline-strong rounded-lg shadow-card-hover overflow-hidden animate-fadeIn"
          role="listbox"
          aria-multiselectable={multiSelect}
        >
          <div className="p-2 border-b border-hairline">
            <div 
              className="flex items-center gap-2 px-2.5 py-1.5 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <Search size={13} className="text-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Search options…"
                className="flex-1 bg-transparent border-0 border-transparent focus:border-transparent focus:ring-0 shadow-none text-sm text-ink placeholder:text-muted outline-none font-medium w-full"
                style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery("");
                  }}
                  className="text-muted hover:text-ink shrink-0 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {multiSelect && filteredOptions.length > 0 && (
            <div className="px-2 pt-2 pb-1 border-b border-hairline">
              <button
                type="button"
                onClick={handleSelectAll}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold text-ink uppercase tracking-wider hover:bg-surface-strong/70 transition-colors cursor-pointer"
              >
                {allSelected ? (
                  <CheckSquare size={13} strokeWidth={2} />
                ) : (
                  <Square size={13} strokeWidth={2} />
                )}
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
          )}

          <ul
            className="overflow-y-auto py-1 px-1.5 space-y-0.5 no-scrollbar"
            style={{ maxHeight: panelMaxHeight }}
          >
            {filteredOptions.length === 0 ? (
              <li className="py-5 text-center text-xs text-muted font-medium">
                No matching results
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const selected = isSelected(option.value);
                const active = index === activeIndex;

                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={selected}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={[
                      "flex items-center justify-between gap-3",
                      "px-3 py-2 rounded-md cursor-pointer",
                      "text-sm transition-colors duration-100",
                      selected
                        ? "bg-surface-strong/80 dark:bg-surface-strong text-ink font-semibold"
                        : active
                        ? "bg-canvas-soft text-ink"
                        : "text-body hover:bg-surface-strong/50 hover:text-ink",
                    ].join(" ")}
                  >
                    <span className="truncate">{option.label}</span>
                    {selected && (
                      <Check
                        size={13}
                        strokeWidth={2.5}
                        className="text-ink shrink-0 ml-3"
                      />
                    )}
                  </li>
                );
              })
            )}
          </ul>

          {multiSelect && selectedValues.length > 0 && (
            <div className="border-t border-hairline px-3 py-2 flex items-center justify-between bg-canvas-soft/80">
              <span className="text-[11px] text-muted font-medium uppercase tracking-wider">
                {selectedValues.length} selected
              </span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] text-error font-medium uppercase tracking-wider hover:opacity-80 transition-opacity cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}