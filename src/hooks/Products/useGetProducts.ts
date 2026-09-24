import { useQuery } from '@tanstack/react-query';
import makeRequest from '../../utils/helpers/MakeRequest';
import {
  PRODUCTS,
  PRODUCTS_SEARCH,
  PRODUCTS_BY_CATEGORY,
} from '../../constants/urls';
import type { ProductsResponse, SortField, SortOrder } from '../../types/Product';

export interface GetProductsParams {
  page: number;
  pageSize: number;
  search: string;
  category: string;
  sortBy: SortField | '';
  order: SortOrder;
}

export const getProductsQueryKey = (params: GetProductsParams) => [
  'products',
  params,
];

export const fetchProducts = async (params: GetProductsParams): Promise<ProductsResponse> => {
  const { page, pageSize, search, category, sortBy, order } = params;
  const skip = (page - 1) * pageSize;

  // DummyJSON doesn't support search + category combined — handle explicitly
  let pathname = PRODUCTS;

  if (search.trim()) {
    pathname = PRODUCTS_SEARCH;
  } else if (category) {
    pathname = PRODUCTS_BY_CATEGORY(category);
  }

  const queryParams: Record<string, string | number> = {
    limit: pageSize,
    skip,
  };

  if (search.trim()) {
    queryParams.q = search.trim();
  }

  if (sortBy) {
    queryParams.sortBy = sortBy;
    queryParams.order = order;
  }

  // makeRequest wraps DummyJSON response as { data: <dummyjson_payload> }
  // DummyJSON returns: { products: [...], total, skip, limit }
  const res = await makeRequest<ProductsResponse>({
    pathname,
    method: 'GET',
    params: queryParams,
  });

  return res?.data ?? { products: [], total: 0, skip: 0, limit: pageSize };
};

export default function useGetProducts(params: GetProductsParams) {
  return useQuery({
    queryKey: getProductsQueryKey(params),
    queryFn: () => fetchProducts(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}
