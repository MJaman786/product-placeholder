import { useQuery } from '@tanstack/react-query';
import makeRequest from '../../utils/helpers/MakeRequest';
import { PRODUCT_BY_ID } from '../../constants/urls';
import type { Product } from '../../types/Product';

export const getProductQueryKey = (id: number | string) => ['product', id];

export const fetchProduct = async (id: number | string): Promise<Product | null> => {
  // makeRequest wraps DummyJSON response as { data: <product> }
  const res = await makeRequest<Product>({
    pathname: PRODUCT_BY_ID(id),
    method: 'GET',
  });
  return res?.data ?? null;
};

export default function useGetProduct(id: number | string | undefined) {
  return useQuery({
    queryKey: getProductQueryKey(id ?? ''),
    queryFn: () => fetchProduct(id!),
    enabled: Boolean(id),
    staleTime: 60_000,
    retry: 1,
  });
}
