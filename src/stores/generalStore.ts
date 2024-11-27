import { create } from 'zustand';
import { Category, Club, clientMode, preMode, User, Supplier } from '../types/types';

interface generalStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;

  clubs: Club[];
  setClubs: (clubs: Club[]) => void;

  clientMode: clientMode;
  setClientMode: (clientMode: clientMode) => void;

  preMode: preMode;
  setPreMode: (preMode: preMode) => void;

  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  currentSupplier: Supplier | null;
  setCurrentSupplier: (supplier: Supplier | null) => void;
}

const useGeneralStore = create<generalStore>((set) => ({
  categories: [],
  setCategories: (categories: Category[]) => set({ categories }),

  clubs: [],
  setClubs: (clubs: Club[]) => set({ clubs }),

  clientMode: clientMode.general,
  setClientMode: (clientMode: clientMode) => set({ clientMode }),

  preMode: preMode.none,
  setPreMode: (preMode: preMode) => set({ preMode }),

  currentUser: null,
  setCurrentUser: (user: User | null) => set({ currentUser: user }),

  currentSupplier: null,
  setCurrentSupplier: (supplier: Supplier | null) => set({ currentSupplier: supplier }),
}));

export default useGeneralStore;
