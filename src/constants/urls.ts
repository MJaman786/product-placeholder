// ─── DummyJSON Base ──────────────────────────────────────────────────────────
// Base URL is set in MakeRequest.ts via VITE_API_URL env or fallback

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const AUTH_LOGIN             = '/auth/login';
export const AUTH_ME                = '/auth/me';

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const PRODUCTS               = '/products';
export const PRODUCT_BY_ID          = (id: number | string) => `/products/${id}`;
export const PRODUCTS_SEARCH        = '/products/search';
export const PRODUCTS_ADD           = '/products/add';
export const PRODUCT_UPDATE         = (id: number | string) => `/products/${id}`;
export const PRODUCT_DELETE         = (id: number | string) => `/products/${id}`;

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export const PRODUCT_CATEGORIES     = '/products/categories';
export const PRODUCTS_BY_CATEGORY   = (category: string) => `/products/category/${category}`;