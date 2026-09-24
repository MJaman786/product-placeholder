// ─── Core Product Shape (DummyJSON) ──────────────────────────────────────────

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode?: string;
  qrCode?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images: string[];
  thumbnail: string;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export type SortField = 'price' | 'rating' | 'title' | 'stock';
export type SortOrder = 'asc' | 'desc';

export interface ProductQueryParams {
  page: number;
  pageSize: number;
  search: string;
  category: string;
  sortBy: SortField | '';
  order: SortOrder;
}

// ─── Mutation Payloads ────────────────────────────────────────────────────────

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  discountPercentage?: number;
  thumbnail?: string;
}

export interface UpdateProductPayload {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  brand?: string;
  discountPercentage?: number;
  thumbnail?: string;
}
