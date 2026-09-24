import React from "react";
import { ChevronLeft } from "lucide-react";

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
  handleBack?: () => void;
  action?: React.ReactNode;
}

export default function PageTitle({
  title,
  description,
  className = "",
  handleBack,
  action,
}: PageTitleProps) {
  return (
    <div
      className={`font-sans my-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}
    >
      <div className="flex items-start gap-3">
        {handleBack && (
          <button
            type="button"
            onClick={handleBack}
            className="p-2 mt-0.5 rounded-md bg-surface-card border border-hairline hover:border-hairline-strong text-muted hover:text-ink hover:bg-canvas-soft/80 dark:hover:bg-surface-strong/60 shadow-card-soft transition-all cursor-pointer active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            aria-label="Go back"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
        )}
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm font-normal text-muted max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}