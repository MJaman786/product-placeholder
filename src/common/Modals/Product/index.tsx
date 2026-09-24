import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  X,
  Package,
  Tag,
  DollarSign,
  BarChart2,
  Layers,
  Star,
  Edit2,
  Eye,
} from "lucide-react";
import InputField from "../../../components/Ui/Input";
import Button from "../../../components/Ui/Buttons/modal.button";
import Dropdown from "../../../components/Ui/Dropdown";
import { useCreateProduct, useUpdateProduct } from "../../../hooks/Products/useProductMutations";
import useGetCategories from "../../../hooks/Products/useGetCategories";
import type { Product, CreateProductPayload, UpdateProductPayload, CategoryItem, ProductReview } from "../../../types/Product";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductModalMode = "create" | "edit" | "view";

interface ProductModalProps {
  mode: ProductModalMode;
  product?: Product | null;
  onClose: () => void;
  onSwitchToEdit?: () => void;
}

// ─── Validation Schema ────────────────────────────────────────────────────────

const productSchema = Yup.object({
  title: Yup.string().trim().min(2, "Title must be at least 2 characters").required("Title is required"),
  description: Yup.string().trim().min(10, "Description must be at least 10 characters").required("Description is required"),
  price: Yup.number().typeError("Price must be a number").min(0.01, "Price must be greater than 0").required("Price is required"),
  stock: Yup.number().typeError("Stock must be a number").integer("Stock must be a whole number").min(0, "Stock cannot be negative").required("Stock is required"),
  category: Yup.string().trim().required("Category is required"),
  brand: Yup.string().trim(),
  discountPercentage: Yup.number().typeError("Must be a number").min(0).max(100).optional(),
});

// ─── Badge Helpers ────────────────────────────────────────────────────────────

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (rating >= 3.5) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-error bg-error/10 border-error/20";
};

const getStockColor = (stock: number) => {
  if (stock > 50) return "text-success bg-success/10 border-success/20";
  if (stock > 10) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-error bg-error/10 border-error/20";
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductModal({ mode, product, onClose, onSwitchToEdit }: ProductModalProps) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const { data: categories = [] } = useGetCategories();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const isSaving = isCreating || isUpdating;

  const categoryOptions = categories.map((c: CategoryItem) => ({
    label: c.name,
    value: c.slug,
  }));

  const formik = useFormik<CreateProductPayload>({
    initialValues: {
      title: product?.title ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      category: product?.category ?? "",
      brand: product?.brand ?? "",
      discountPercentage: product?.discountPercentage ?? 0,
      thumbnail: product?.thumbnail ?? "",
    },
    validationSchema: productSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        stock: Number(values.stock),
        category: values.category,
        brand: values.brand?.trim() || undefined,
        discountPercentage: values.discountPercentage ? Number(values.discountPercentage) : undefined,
        thumbnail: values.thumbnail?.trim() || undefined,
      };

      if (isEdit && product) {
        updateProduct(
          { id: product.id, payload: payload as UpdateProductPayload },
          { onSuccess: onClose }
        );
      } else if (isCreate) {
        createProduct(payload as CreateProductPayload, { onSuccess: onClose });
      }
    },
  });

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // ─── Title / icon by mode ───────────────────────────────────────────────────
  const modalTitle =
    isCreate ? "Add New Product"
    : isEdit ? "Edit Product"
    : "Product Details";

  const modalIcon =
    isCreate ? <Package size={16} className="text-on-primary" />
    : isEdit  ? <Edit2   size={16} className="text-on-primary" />
    :           <Eye     size={16} className="text-on-primary" />;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-card border border-hairline-strong rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-card-hover font-sans animate-slideUp">

        {/* Modal Header */}
        <div className="sticky top-0 bg-surface-card border-b border-hairline px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
              {modalIcon}
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink font-poppins">{modalTitle}</h2>
              {product && (
                <p className="text-[11px] font-mono text-muted">ID: #{product.id}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isView && onSwitchToEdit && (
              <button
                type="button"
                onClick={onSwitchToEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary hover:bg-primary-active text-on-primary text-xs font-medium transition-all cursor-pointer"
              >
                <Edit2 size={12} />
                <span>Edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-md text-muted hover:text-ink hover:bg-surface-strong/60 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── VIEW MODE ─────────────────────────────────────────────────────── */}
        {isView && product && (
          <div className="p-6 space-y-6">
            {/* Product image + name hero */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-40 h-40 shrink-0 rounded-xl border border-hairline bg-canvas-soft overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://dummyjson.com/image/400x300"; }}
                />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-ink leading-tight">{product.title}</h3>
                {product.brand && (
                  <p className="text-xs text-muted font-mono">{product.brand}</p>
                )}
                <p className="text-sm text-body leading-relaxed">{product.description}</p>

                {/* Tags */}
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full border border-hairline bg-canvas-soft text-muted text-[10px] font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}  
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Price", value: `$${product.price.toFixed(2)}`, icon: <DollarSign size={14} />, color: "text-primary" },
                { label: "Rating", value: `${product.rating}/5`, icon: <Star size={14} />, color: getRatingColor(product.rating).split(" ")[0] },
                { label: "Stock", value: String(product.stock), icon: <Layers size={14} />, color: getStockColor(product.stock).split(" ")[0] },
                { label: "Discount", value: `${product.discountPercentage ?? 0}%`, icon: <BarChart2 size={14} />, color: "text-body" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="p-3 rounded-lg border border-hairline bg-canvas-soft/60 space-y-1">
                  <p className="text-[10px] font-mono text-muted uppercase tracking-wider">{label}</p>
                  <p className={`text-sm font-bold font-mono flex items-center gap-1 ${color}`}>
                    {icon}{value}
                  </p>
                </div>
              ))}
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 p-3 rounded-lg border border-hairline bg-canvas-soft/40">
              <Tag size={13} className="text-muted shrink-0" />
              <span className="text-xs text-muted">Category:</span>
              <span className="text-xs font-semibold text-ink capitalize">{product.category}</span>
              {product.availabilityStatus && (
                <>
                  <span className="text-hairline-strong mx-1">·</span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-full border ${
                    product.availabilityStatus === "In Stock" ? "text-success bg-success/10 border-success/20" : "text-error bg-error/10 border-error/20"
                  }`}>
                    {product.availabilityStatus}
                  </span>
                </>
              )}
            </div>

            {/* Product images strip */}
            {product.images && product.images.length > 1 && (
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-muted uppercase tracking-wider">All Images</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {product.images.map((img: string, i: number) => (
                    <div key={i} className="w-20 h-20 shrink-0 rounded-lg border border-hairline overflow-hidden bg-canvas-soft">
                      <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://dummyjson.com/image/80x80"; }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-muted uppercase tracking-wider">Customer Reviews</p>
                <div className="space-y-2">
                  {product.reviews.slice(0, 3).map((rev: ProductReview, i: number) => (
                    <div key={i} className="p-3 rounded-lg border border-hairline bg-canvas-soft/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-ink">{rev.reviewerName}</span>
                        <span className="text-[10px] font-mono text-amber-500">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                      </div>
                      <p className="text-xs text-body">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CREATE / EDIT FORM ─────────────────────────────────────────────── */}
        {(isCreate || isEdit) && (
          <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
            {/* Thumbnail preview */}
            {formik.values.thumbnail && (
              <div className="w-full h-36 rounded-xl border border-hairline bg-canvas-soft overflow-hidden">
                <img
                  src={formik.values.thumbnail}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}

            <InputField
              label="Product Title *"
              name="title"
              placeholder="e.g. Apple MacBook Pro"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.title}
              error={formik.errors.title}
              disabled={isSaving}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Price (USD) *"
                name="price"
                type="number"
                placeholder="e.g. 999.99"
                icon={<DollarSign size={14} />}
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.price}
                error={formik.errors.price as string}
                disabled={isSaving}
              />
              <InputField
                label="Stock *"
                name="stock"
                type="number"
                placeholder="e.g. 100"
                icon={<Layers size={14} />}
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.stock}
                error={formik.errors.stock as string}
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Brand"
                name="brand"
                placeholder="e.g. Apple"
                value={formik.values.brand ?? ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.brand}
                error={formik.errors.brand}
                disabled={isSaving}
              />
              <InputField
                label="Discount %"
                name="discountPercentage"
                type="number"
                placeholder="e.g. 10"
                value={formik.values.discountPercentage ?? 0}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.discountPercentage}
                error={formik.errors.discountPercentage as string}
                disabled={isSaving}
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-body uppercase tracking-wider">
                Category *
              </label>
              {categoryOptions.length > 0 ? (
                <Dropdown
                  options={categoryOptions}
                  value={formik.values.category}
                  onChange={(val: string | string[]) => formik.setFieldValue("category", Array.isArray(val) ? val[0] : val)}
                  placeholder="Select a category"
                  height="42px"
                />
              ) : (
                <input
                  name="category"
                  placeholder="e.g. smartphones"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  className="w-full h-11 bg-surface-card border border-hairline-strong rounded-md px-3.5 text-sm text-ink placeholder:text-muted outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all"
                />
              )}
              {formik.touched.category && formik.errors.category && (
                <p className="text-xs text-error font-medium">{formik.errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-body uppercase tracking-wider">
                Description *
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Product description..."
                value={formik.values.description}
                onChange={formik.handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                onBlur={formik.handleBlur as React.FocusEventHandler<HTMLTextAreaElement>}
                disabled={isSaving}
                className={`w-full bg-surface-card border text-sm text-ink placeholder:text-muted rounded-md px-3.5 py-2.5 resize-none outline-none transition-all duration-150
                  ${formik.touched.description && formik.errors.description
                    ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
                    : "border-hairline-strong hover:border-primary/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-xs text-error font-medium">{formik.errors.description}</p>
              )}
            </div>

            {/* Thumbnail URL */}
            <InputField
              label="Thumbnail URL"
              name="thumbnail"
              placeholder="https://..."
              value={formik.values.thumbnail ?? ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isSaving}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-hairline">
              <Button label="Cancel" variant="clear" onClick={onClose} disabled={isSaving} />
              <Button
                label={isEdit ? "Save Changes" : "Add Product"}
                loadingLabel={isEdit ? "Saving..." : "Adding..."}
                type="submit"
                isLoading={isSaving}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
