import { create } from 'zustand';
import { Category, Club, clientMode, preMode } from '../types/types';

interface generalStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;

  clubs: Club[];
  setClubs: (clubs: Club[]) => void;

  clientMode: clientMode;
  setClientMode: (clientMode: clientMode) => void;

  preMode: preMode;
  setPreMode: (preMode: preMode) => void;
}

const useGeneralStore = create<generalStore>((set) => ({
  categories: [],
  setCategories: (categories: Category[]) => set({ categories }),

  clubs: [],
  setClubs: (clubs: Club[]) => set({ clubs }),

  clientMode: clientMode.user,
  setClientMode: (clientMode: clientMode) => set({ clientMode }),

  preMode: preMode.none,
  setPreMode: (preMode: preMode) => set({ preMode }),

}));

export default useGeneralStore;