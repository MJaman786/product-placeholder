import { useQuery } from '@tanstack/react-query';
import makeRequest from '../../utils/helpers/MakeRequest';
import { PRODUCT_CATEGORIES } from '../../constants/urls';
import type { CategoryItem } from '../../types/Product';

export const getCategoriesQueryKey = () => ['product-categories'];

export const fetchCategories = async (): Promise<CategoryItem[]> => {
  // DummyJSON returns an array of { slug, name, url } objects
  const res = await makeRequest<CategoryItem[]>({
    pathname: PRODUCT_CATEGORIES,
    method: 'GET',
  });
  return res?.data ?? [];
};

export default function useGetCategories() {
  return useQuery({
    queryKey: getCategoriesQueryKey(),
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
