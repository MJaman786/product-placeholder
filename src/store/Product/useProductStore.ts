import { create } from 'zustand';
import type { Product } from '../../types/Product';

/**
 * Local product override store.
 *
 * DummyJSON does not persist mutations (add/edit/delete).
 * After a successful API call we mirror the change locally so the UI
 * reflects the operation for the current session.
 */
interface ProductStore {
  // Products created locally this session
  localCreated: Product[];
  // Products updated locally — keyed by id
  localUpdated: Record<number, Partial<Product>>;
  // IDs of products deleted locally this session
  localDeleted: Set<number>;

  // Actions
  addLocalProduct: (product: Product) => void;
  updateLocalProduct: (id: number, patch: Partial<Product>) => void;
  deleteLocalProduct: (id: number) => void;
  reset: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  localCreated: [],
  localUpdated: {},
  localDeleted: new Set(),

  addLocalProduct: (product) =>
    set((state) => ({
      localCreated: [product, ...state.localCreated],
    })),

  updateLocalProduct: (id, patch) =>
    set((state) => ({
      localUpdated: {
        ...state.localUpdated,
        [id]: { ...(state.localUpdated[id] ?? {}), ...patch },
      },
    })),

  deleteLocalProduct: (id) =>
    set((state) => {
      const next = new Set(state.localDeleted);
      next.add(id);
      // Also remove from localCreated if it was added this session
      return {
        localDeleted: next,
        localCreated: state.localCreated.filter((p) => p.id !== id),
      };
    }),

  reset: () =>
    set({
      localCreated: [],
      localUpdated: {},
      localDeleted: new Set(),
    }),
}));
