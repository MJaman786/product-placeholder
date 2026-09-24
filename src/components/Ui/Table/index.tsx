import React from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export type Column<T> = {
  label: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
};

interface DataTableProp<T> {
  column: Column<T>[];
  data?: T[];
  page?: number;
  totalPages?: number;
  totalItems?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isFetching?: boolean;
  isFooter?: boolean;
}

const getStatusBadge = (status: string) => {
  const normalized = String(status).toUpperCase();
  switch (normalized) {
    case "APPROVED":
    case "ACTIVE":
    case "COMPLETED":
      return "bg-success/10 text-success border-success/20";
    case "PENDING":
    case "SUSPENDED":
    case "IN_PROGRESS":
      return "bg-warning/15 text-warning border-warning/30";
    case "REJECTED":
    case "BANNED":
    case "ARCHIVED":
      return "bg-error/10 text-error border-error/20";
    default:
      return "bg-surface-strong/60 text-body border-hairline-strong";
  }
};

const LIMIT_OPTIONS = [5, 10, 20, 50];

export default function CustomTable<T extends Record<string, any>>({
  column,
  data,
  page = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  isFetching,
  isFooter = true,
}: DataTableProp<T>) {
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  if (isFetching) {
    return (
      <div className="w-full py-16 flex items-center justify-center bg-surface-card border border-hairline-strong rounded-lg shadow-card-soft">
        <div className="flex items-center gap-2 text-muted font-sans text-xs">
          <div className="w-4 h-4 rounded-pill border-2 border-primary border-t-transparent animate-spin" />
          <span>Loading records…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface-card border border-hairline rounded-lg overflow-hidden shadow-card-soft font-sans">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-canvas-soft/80 border-b border-hairline">
              {column.map((col, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-[11px] font-mono font-medium text-muted uppercase tracking-wider ${
                    col.label === "Actions" ? "text-right" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-hairline">
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-surface-strong/30 dark:hover:bg-surface-strong/40 transition-colors duration-100"
                >
                  {column.map((col, colIndex) => {
                    const value = row[col.accessor];
                    return (
                      <td
                        key={colIndex}
                        className={`px-4 py-3.5 text-sm text-ink ${
                          col.label === "Actions" ? "text-right" : ""
                        }`}
                      >
                        {col.render ? (
                          col.render(value, row)
                        ) : col.accessor === "status" || col.label === "Status" ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-pill border text-[10.5px] font-mono font-medium tracking-wide uppercase ${getStatusBadge(
                              String(value)
                            )}`}
                          >
                            {String(value)}
                          </span>
                        ) : (
                          <span className="font-normal text-body hover:text-ink transition-colors">
                            {String(value ?? "—")}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={column.length} className="py-16">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <div className="w-10 h-10 bg-surface-strong/40 border border-hairline rounded-md flex items-center justify-center text-muted">
                      <Inbox size={18} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-ink">No data available</p>
                      <p className="text-xs text-muted mt-0.5">
                        There are no records matching your current filter criteria.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {isFooter && (
        <div className="px-4 py-3 border-t border-hairline bg-canvas-soft/60 flex items-center justify-between flex-wrap gap-3 text-xs">
          {/* Item Count & Page Limit Selector */}
          <div className="flex items-center gap-3">
            <p className="text-body font-normal">
              Showing{" "}
              <span className="font-mono font-medium text-ink">{startItem}</span>–
              <span className="font-mono font-medium text-ink">{endItem}</span> of{" "}
              <span className="font-mono font-medium text-ink">{totalItems}</span>
            </p>

            <div className="flex items-center bg-surface-card border border-hairline rounded-md p-0.5 shadow-2xs">
              {LIMIT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onLimitChange?.(opt);
                  }}
                  className={`px-2 py-0.5 rounded-xs font-mono text-[11px] font-medium transition-all cursor-pointer ${
                    limit === opt
                      ? "bg-surface-strong text-ink shadow-2xs"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5">
            {/* Previous Page */}
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              aria-label="Previous page"
              className="w-8 h-8 rounded-md border border-hairline bg-surface-card text-body hover:border-primary/50 hover:text-ink disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((p, index) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-6 text-center text-muted font-mono"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange?.(p as number)}
                    className={`min-w-8 h-8 px-2 rounded-md font-mono text-xs font-medium transition-colors cursor-pointer flex items-center justify-center ${
                      p === page
                        ? "bg-primary text-on-primary font-semibold shadow-card-soft"
                        : "text-body hover:bg-surface-strong/80 hover:text-ink"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            {/* Next Page */}
            <button
              type="button"
              disabled={page >= totalPages || totalPages === 0}
              onClick={() => onPageChange?.(page + 1)}
              aria-label="Next page"
              className="w-8 h-8 rounded-md border border-hairline bg-surface-card text-body hover:border-primary/50 hover:text-ink disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}