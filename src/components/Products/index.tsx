import React, { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Star,
  Package,
  Tag,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  ChevronDown,
  X,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CustomTable, { type Column } from "../Ui/Table";
import Dropdown from "../Ui/Dropdown";
import Button from "../Ui/Buttons/modal.button";
import ActionButton from "../Ui/Buttons/action.button";
import ProductModal, { type ProductModalMode } from "../../common/Modals/Product";
import useGetProducts from "../../hooks/Products/useGetProducts";
import useGetCategories from "../../hooks/Products/useGetCategories";
import { useDeleteProduct } from "../../hooks/Products/useProductMutations";
import { useProductStore } from "../../store/Product/useProductStore";
import { useDebounce } from "../../utils/helpers/Debouncing";
import type { Product, SortField, SortOrder, ProductQueryParams } from "../../types/Product";

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Default Order",    value: "" },
  { label: "Price: Low → High",  value: "price|asc"    },
  { label: "Price: High → Low",  value: "price|desc"   },
  { label: "Rating: High → Low", value: "rating|desc"  },
  { label: "Rating: Low → High", value: "rating|asc"   },
  { label: "Title: A → Z",       value: "title|asc"    },
  { label: "Title: Z → A",       value: "title|desc"   },
];

const PAGE_SIZES = [5, 10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

// ─── URL helpers ──────────────────────────────────────────────────────────────

function parseParams(sp: URLSearchParams): ProductQueryParams {
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const pageSize = PAGE_SIZES.includes(parseInt(sp.get("pageSize") ?? "", 10))
    ? (parseInt(sp.get("pageSize")!, 10) as 10 | 20 | 50)
    : DEFAULT_PAGE_SIZE;
  const search   = sp.get("search")   ?? "";
  const category = sp.get("category") ?? "";
  const sortBy   = (sp.get("sortBy") ?? "") as SortField | "";
  const order    = (sp.get("order")  ?? "asc") as SortOrder;
  return { page, pageSize, search, category, sortBy, order };
}

// ─── Rating Badge ─────────────────────────────────────────────────────────────

const RatingBadge = ({ rating }: { rating: number }) => {
  const cls =
    rating >= 4.5 ? "badge-success"
    : rating >= 3.5 ? "badge-warning"
    : "badge-error";
  return (
    <span className={`badge ${cls}`}>
      <Star size={8} className="fill-current" />
      {rating.toFixed(1)}
    </span>
  );
};

// ─── Stock Badge ──────────────────────────────────────────────────────────────

const StockBadge = ({ stock }: { stock: number }) => {
  const cls   = stock > 50 ? "badge-success" : stock > 10 ? "badge-warning" : "badge-error";
  const label = stock > 50 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock";
  return (
    <div className="space-y-0.5">
      <span className={`badge ${cls}`}>{label}</span>
      <p className="text-[10px] font-mono text-muted pl-0.5">{stock} units</p>
    </div>
  );
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-hairline">
          <td className="px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Skeleton width={42} height={42} borderRadius={8} />
              <div>
                <Skeleton width={130} height={12} />
                <Skeleton width={80} height={10} style={{ marginTop: 4 }} />
              </div>
            </div>
          </td>
          {[90, 70, 60, 55, 60].map((w, j) => (
            <td key={j} className="px-4 py-3.5"><Skeleton width={w} height={12} /></td>
          ))}
          <td className="px-4 py-3.5 text-right"><Skeleton width={88} height={30} borderRadius={6} /></td>
        </tr>
      ))}
    </>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3.5 bg-surface-card border border-hairline rounded-xl px-4 py-3.5 shadow-card-soft">
      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-mono font-medium text-muted uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-ink leading-tight font-mono">{value}</p>
        {sub && <p className="text-[10px] text-muted">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Mobile Product Card ──────────────────────────────────────────────────────

function ProductCard({
  product,
  onView, onEdit, onDelete,
}: {
  product: Product;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-surface-card border border-hairline rounded-xl p-4 shadow-card-soft hover:shadow-card-hover hover:border-primary/25 transition-all duration-200 animate-fadeIn">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="product-thumb w-16 h-16 shrink-0 cursor-pointer" onClick={onView}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://dummyjson.com/image/64x64?type=webp&bgColor=f4f4f5"; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-ink truncate leading-tight">{product.title}</h3>
          <p className="text-[11px] text-muted font-mono capitalize mt-0.5">{product.brand ? `${product.brand} · ` : ""}{product.category}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-primary font-mono">${product.price.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="badge badge-success text-[9px]">-{product.discountPercentage.toFixed(0)}%</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-hairline">
        <div className="flex items-center gap-2">
          <RatingBadge rating={product.rating} />
          <StockBadge stock={product.stock} />
        </div>
        <div className="flex items-center gap-1">
          <ActionButton icon={<Eye size={13} />}    title="View"   onClick={onView}   variant="default" />
          <ActionButton icon={<Edit2 size={13} />}  title="Edit"   onClick={onEdit}   variant="default" />
          <ActionButton icon={<Trash2 size={13} />} title="Delete" onClick={onDelete} variant="danger"  />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductsComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = parseParams(searchParams);

  const [rawSearch, setRawSearch] = React.useState(params.search);
  const debouncedSearch = useDebounce(rawSearch, 400);

  const [modalMode,       setModalMode]       = React.useState<ProductModalMode | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [deleteTarget,    setDeleteTarget]    = React.useState<Product | null>(null);
  const [showFilters,     setShowFilters]     = React.useState(false);

  // Sync debounced search → URL
  React.useEffect(() => {
    if (debouncedSearch !== params.search) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        debouncedSearch ? next.set("search", debouncedSearch) : next.delete("search");
        next.set("page", "1");
        return next;
      }, { replace: true });
    }
  }, [debouncedSearch]);

  const updateParams = useCallback((updates: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        value ? next.set(key, value) : next.delete(key);
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  // Fetch
  const queryParams = {
    page:     params.page,
    pageSize: params.pageSize,
    search:   debouncedSearch,
    category: params.category,
    sortBy:   params.sortBy,
    order:    params.order,
  };

  const { data, isLoading, isFetching, isError, refetch } = useGetProducts(queryParams);
  const { data: categories = [] }                          = useGetCategories();
  const { mutate: deleteProduct, isPending: isDeleting }   = useDeleteProduct();
  const { localCreated, localUpdated, localDeleted }       = useProductStore();

  // Merge API data with local overrides
  const products = useMemo(() => {
    const apiProducts = data?.products ?? [];
    const merged = apiProducts
      .filter((p) => !localDeleted.has(p.id))
      .map((p)   => (localUpdated[p.id] ? { ...p, ...localUpdated[p.id] } : p));
    if (params.page === 1 && !debouncedSearch && !params.category) {
      return [...localCreated, ...merged];
    }
    return merged;
  }, [data, localCreated, localUpdated, localDeleted, params.page, debouncedSearch, params.category]);

  const totalItems = (data?.total ?? 0) + localCreated.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.pageSize));

  const categoryOptions = [
    { label: "All Categories", value: "" },
    ...categories.map((c) => ({ label: c.name, value: c.slug })),
  ];
  const currentSortValue = params.sortBy ? `${params.sortBy}|${params.order}` : "";
  const hasFilters = Boolean(rawSearch || params.category || params.sortBy);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const openModal = (mode: ProductModalMode, product: Product | null = null) => {
    setSelectedProduct(product);
    setModalMode(mode);
  };

  const closeModal = () => { setModalMode(null); setSelectedProduct(null); };

  const handleSortChange = (val: string | string[]) => {
    const str = Array.isArray(val) ? val[0] : val;
    if (!str) { 
      updateParams({ sortBy: "", order: "", page: "1" });
    } else {
      const [field, ord] = str.split("|");
      updateParams({ sortBy: field, order: ord, page: "1" });
    }
  };

  const handleCategoryChange = (val: string | string[]) => {
    const str = Array.isArray(val) ? val[0] : val;
    updateParams({ category: str, page: "1" });
    if (str && rawSearch) setRawSearch("");
  };

  const handleResetFilters = () => {
    setRawSearch("");
    setSearchParams({});
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(
      { id: deleteTarget.id, title: deleteTarget.title },
      { onSuccess: () => setDeleteTarget(null) }
    );
  };

  // ─── Table Columns ──────────────────────────────────────────────────────────

  const columns: Column<Product>[] = [
    {
      label: "Product",
      accessor: "title",
      render: (val: string, row: Product) => (
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="product-thumb w-11 h-11 shrink-0 cursor-pointer"
            onClick={() => openModal("view", row)}
          >
            <img
              src={row.thumbnail}
              alt={val}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://dummyjson.com/image/44x44?type=webp&bgColor=f4f4f5"; }}
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-xs text-ink max-w-[180px] truncate leading-snug">{val}</p>
            <p className="text-[10.5px] font-mono text-muted mt-0.5 truncate">{row.brand || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      label: "Category",
      accessor: "category",
      render: (val: string) => (
        <span className="badge badge-primary capitalize">
          <Tag size={9} />{val}
        </span>
      ),
    },
    {
      label: "Price",
      accessor: "price",
      render: (val: number, row: Product) => (
        <div>
          <span className="font-mono font-bold text-sm text-ink">${val.toFixed(2)}</span>
          {row.discountPercentage > 0 && (
            <p className="text-[10px] font-mono text-success mt-0.5">−{row.discountPercentage.toFixed(0)}% off</p>
          )}
        </div>
      ),
    },
    {
      label: "Rating",
      accessor: "rating",
      render: (val: number) => <RatingBadge rating={val} />,
    },
    {
      label: "Stock",
      accessor: "stock",
      render: (val: number) => <StockBadge stock={val} />,
    },
    {
      label: "Actions",
      accessor: "id",
      render: (_: number, row: Product) => (
        <div className="flex items-center justify-end gap-1">
          <ActionButton icon={<Eye size={13} />}    title="View Details"  onClick={() => openModal("view", row)}  variant="default" />
          <ActionButton icon={<Edit2 size={13} />}  title="Edit Product"  onClick={() => openModal("edit", row)}  variant="default" />
          <ActionButton icon={<Trash2 size={13} />} title="Delete Product" onClick={() => setDeleteTarget(row)}   variant="danger"  />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans text-ink">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-poppins">
            Products Catalog
          </h1>
          <p className="text-sm text-muted mt-1">
            Manage your product inventory — search, filter, sort and perform CRUD operations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal("create")}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-primary hover:bg-primary-active text-on-primary text-sm font-semibold shadow-card-soft hover:shadow-card-hover transition-all duration-150 cursor-pointer active:scale-[0.97] shrink-0 self-start"
        >
          <span className="text-lg leading-none">＋</span>
          Add Product
        </button>
      </div>

      {/* ── Stats Banner ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Package size={18} />}
          label="Total Products"
          value={isLoading ? "—" : String(totalItems)}
          sub="In catalog"
        />
        <StatCard
          icon={<ShoppingCart size={18} />}
          label="Low Stock"
          value={isLoading ? "—" : String(products.filter(p => p.stock <= 10).length)}
          sub="Need attention"
        />
        <StatCard
          icon={<Star size={18} />}
          label="Avg. Rating"
          value={
            isLoading || products.length === 0
              ? "—"
              : (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(2)
          }
          sub="Current page"
        />
        <StatCard
          icon={<BarChart3 size={18} />}
          label="Categories"
          value={isLoading ? "—" : String(categories.length)}
          sub="Available"
        />
      </div>

      {/* ── Search + Filters ─────────────────────────────────────────────── */}
      <div className="bg-surface-card border border-hairline rounded-xl shadow-card-soft">
        {/* Search row */}
        <div className="flex items-center gap-2 p-3 border-b border-hairline">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              id="product-search"
              type="text"
              placeholder="Search products by name…"
              value={rawSearch}
              onChange={(e) => {
                setRawSearch(e.target.value);
                if (e.target.value && params.category) updateParams({ category: "" });
              }}
              className="w-full h-9 pl-9 pr-8 bg-canvas border border-hairline rounded-lg text-sm text-ink placeholder:text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            />
            {rawSearch && (
              <button
                type="button"
                onClick={() => setRawSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 h-9 rounded-lg border text-sm font-medium transition-all cursor-pointer shrink-0 ${
              hasFilters
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-hairline-strong bg-canvas text-body hover:text-ink hover:border-primary/40"
            }`}
          >
            <TrendingUp size={14} />
            <span className="hidden sm:inline">Filters</span>
            {hasFilters && <span className="w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center">{[params.category, params.sortBy].filter(Boolean).length}</span>}
            <ChevronDown size={12} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>

          {/* Reset */}
          {hasFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-hairline-strong bg-canvas text-muted hover:text-error hover:border-error/40 text-xs font-medium transition-all cursor-pointer shrink-0"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Collapsible filter row */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3 p-3 bg-canvas-soft/60 border-b border-hairline animate-fadeIn">
            <div className="flex-1">
              <label className="block text-[10px] font-mono font-medium text-muted uppercase tracking-wider mb-1.5">Category</label>
              <Dropdown
                options={categoryOptions}
                value={params.category}
                onChange={handleCategoryChange}
                placeholder="All Categories"
                height="36px"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-mono font-medium text-muted uppercase tracking-wider mb-1.5">Sort By</label>
              <Dropdown
                options={SORT_OPTIONS}
                value={currentSortValue}
                onChange={handleSortChange}
                placeholder="Default Order"
                height="36px"
              />
            </div>
          </div>
        )}

        {/* API limitation notice */}
        {rawSearch && params.category && (
          <div className="px-4 py-2.5 bg-warning/8 border-b border-warning/20">
            <p className="text-[11px] text-warning font-medium flex items-center gap-1.5">
              <AlertTriangle size={11} />
              DummyJSON API doesn't support search + category together — category filter was cleared.
            </p>
          </div>
        )}

        {/* Result count */}
        <div className="px-4 py-2 flex items-center justify-between">
          <p className="text-xs text-muted">
            {isLoading ? "Loading…" : (
              <>
                <span className="font-mono font-semibold text-ink">{products.length}</span> products shown
                {totalItems > 0 && <> · <span className="font-mono font-semibold text-ink">{totalItems}</span> total</>}
              </>
            )}
          </p>
          {isFetching && !isLoading && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted font-mono">
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Refreshing…
            </div>
          )}
        </div>
      </div>

      {/* ── Error State ───────────────────────────────────────────────────── */}
      {isError && (
        <div className="flex flex-col items-center justify-center gap-4 p-12 bg-surface-card border border-hairline rounded-xl text-center animate-fadeIn">
          <div className="w-14 h-14 bg-error/10 border border-error/20 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={24} className="text-error" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink">Failed to load products</p>
            <p className="text-xs text-muted mt-1 max-w-xs">
              Could not reach DummyJSON API. Check your connection and try again.
            </p>
          </div>
          <Button label="Retry" onClick={() => refetch()} variant="clear" />
        </div>
      )}

      {/* ── Desktop Table ─────────────────────────────────────────────────── */}
      {!isError && (
        <div className="hidden sm:block">
          {isLoading ? (
            <div className="bg-surface-card border border-hairline rounded-xl overflow-hidden shadow-card-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-canvas border-b border-hairline">
                      {["Product", "Category", "Price", "Rating", "Stock", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-[10px] font-mono font-semibold text-muted uppercase tracking-widest">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    <SkeletonRows count={params.pageSize > 10 ? 10 : params.pageSize} />
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className={`transition-opacity duration-200 ${isFetching ? "opacity-70" : "opacity-100"}`}>
              <CustomTable<Product>
                column={columns}
                data={products}
                page={params.page}
                totalPages={totalPages}
                totalItems={totalItems}
                limit={params.pageSize}
                onPageChange={(p) => updateParams({ page: String(p) })}
                onLimitChange={(l) => updateParams({ pageSize: String(l), page: "1" })}
                isFooter
              />
            </div>
          )}
        </div>
      )}

      {/* ── Mobile Cards ──────────────────────────────────────────────────── */}
      {!isError && (
        <div className="sm:hidden">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-card border border-hairline rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton width={64} height={64} borderRadius={8} />
                    <div className="flex-1">
                      <Skeleton width="70%" height={13} />
                      <Skeleton width="50%" height={10} style={{ marginTop: 5 }} />
                      <Skeleton width={60}  height={12} style={{ marginTop: 7 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center animate-fadeIn">
              <div className="w-14 h-14 bg-primary-light border border-primary/20 rounded-2xl flex items-center justify-center">
                <Package size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">No products found</p>
                <p className="text-xs text-muted mt-1">Try adjusting your search or filters.</p>
              </div>
              {hasFilters && <Button label="Reset Filters" variant="clear" onClick={handleResetFilters} />}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={() => openModal("view", product)}
                    onEdit={() => openModal("edit", product)}
                    onDelete={() => setDeleteTarget(product)}
                  />
                ))}
              </div>

              {/* Mobile Pagination */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-hairline">
                <button
                  type="button"
                  disabled={params.page <= 1}
                  onClick={() => updateParams({ page: String(params.page - 1) })}
                  className="px-4 h-9 rounded-lg border border-hairline bg-surface-card text-sm text-body hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-medium"
                >
                  ← Prev
                </button>
                <span className="text-xs font-mono text-muted">
                  Page {params.page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={params.page >= totalPages}
                  onClick={() => updateParams({ page: String(params.page + 1) })}
                  className="px-4 h-9 rounded-lg border border-hairline bg-surface-card text-sm text-body hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-medium"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Empty State (desktop) ─────────────────────────────────────────── */}
      {!isError && !isLoading && products.length === 0 && (
        <div className="hidden sm:flex flex-col items-center gap-4 py-24 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-primary-light border border-primary/20 rounded-2xl flex items-center justify-center">
            <Package size={28} className="text-primary" />
          </div>
          <div>
            <p className="text-base font-bold text-ink">No products found</p>
            <p className="text-sm text-muted mt-1">
              {hasFilters ? "Try adjusting your search or filters." : "Add your first product to get started."}
            </p>
          </div>
          {hasFilters && <Button label="Reset Filters" variant="clear" onClick={handleResetFilters} />}
        </div>
      )}

      {/* ── Product Modal ─────────────────────────────────────────────────── */}
      {modalMode && (
        <ProductModal
          mode={modalMode}
          product={selectedProduct}
          onClose={closeModal}
          onSwitchToEdit={() => setModalMode("edit")}
        />
      )}

      {/* ── Delete Confirmation ───────────────────────────────────────────── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
        >
          <div className="bg-surface-card border border-hairline-strong rounded-2xl w-full max-w-sm p-6 shadow-card-hover font-sans animate-slideUp">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-error/10 border border-error/20 flex items-center justify-center shrink-0">
                <Trash2 size={18} className="text-error" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Delete Product</h3>
                <p className="text-xs text-body mt-1.5 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-ink">"{deleteTarget.title}"</span>?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Product preview in confirm dialog */}
            <div className="flex items-center gap-3 p-3 bg-canvas rounded-lg border border-hairline mb-5">
              <img
                src={deleteTarget.thumbnail}
                alt={deleteTarget.title}
                className="w-10 h-10 rounded-lg object-cover border border-hairline"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://dummyjson.com/image/40x40?type=webp&bgColor=f4f4f5"; }}
              />
              <div>
                <p className="text-xs font-semibold text-ink truncate max-w-[180px]">{deleteTarget.title}</p>
                <p className="text-[10.5px] font-mono text-muted">${deleteTarget.price.toFixed(2)} · {deleteTarget.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                label="Cancel"
                variant="clear"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1"
              />
              <Button
                label="Delete"
                loadingLabel="Deleting..."
                variant="cancel"
                isLoading={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
