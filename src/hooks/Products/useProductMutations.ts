import { useMutation, useQueryClient } from '@tanstack/react-query';
import makeRequest from '../../utils/helpers/MakeRequest';
import { PRODUCTS_ADD, PRODUCT_UPDATE, PRODUCT_DELETE } from '../../constants/urls';
import { useProductStore } from '../../store/Product/useProductStore';
import showToast from '../../utils/helpers/ShowToast';
import type { Product, CreateProductPayload, UpdateProductPayload } from '../../types/Product';

// ─── Create Product ───────────────────────────────────────────────────────────

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { addLocalProduct } = useProductStore();

  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      // DummyJSON POST /products/add returns the new product object directly
      const res = await makeRequest<Product>({
        pathname: PRODUCTS_ADD,
        method: 'POST',
        values: payload,
        showMessage: false,
      });
      if (!res?.data?.id) throw new Error('Failed to create product');
      return res.data;
    },
    onSuccess: (data) => {
      addLocalProduct(data);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast({ msg: `"${data.title}" added successfully!`, type: 'success' });
    },
    onError: () => {
      showToast({ msg: 'Failed to create product. Please try again.', type: 'error' });
    },
  });
}

// ─── Update Product ───────────────────────────────────────────────────────────

interface UpdateProductArgs {
  id: number;
  payload: UpdateProductPayload;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { updateLocalProduct } = useProductStore();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateProductArgs) => {
      // DummyJSON PUT /products/:id returns the updated product object directly
      const res = await makeRequest<Product>({
        pathname: PRODUCT_UPDATE(id),
        method: 'PUT',
        values: payload,
        showMessage: false,
      });
      if (!res?.data?.id) throw new Error('Failed to update product');
      return res.data;
    },
    onSuccess: (data) => {
      updateLocalProduct(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      showToast({ msg: `"${data.title}" updated successfully!`, type: 'success' });
    },
    onError: () => {
      showToast({ msg: 'Failed to update product. Please try again.', type: 'error' });
    },
  });
}

// ─── Delete Product ───────────────────────────────────────────────────────────

interface DeleteProductArgs {
  id: number;
  title: string;
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { deleteLocalProduct } = useProductStore();

  return useMutation({
    mutationFn: async ({ id }: DeleteProductArgs) => {
      // DummyJSON DELETE /products/:id returns { isDeleted: true, deletedOn: ... }
      const res = await makeRequest<{ isDeleted: boolean; deletedOn: string }>({
        pathname: PRODUCT_DELETE(id),
        method: 'DELETE',
        showMessage: false,
      });
      if (!res?.data?.isDeleted) throw new Error('Failed to delete product');
      return res.data;
    },
    onSuccess: (_, variables) => {
      deleteLocalProduct(variables.id);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast({ msg: `"${variables.title}" deleted.`, type: 'success' });
    },
    onError: () => {
      showToast({ msg: 'Failed to delete product. Please try again.', type: 'error' });
    },
  });
}
