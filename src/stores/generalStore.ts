import { create } from "zustand";
import { Category, Club, ClientMode, PreMode } from "@/types/types";


interface generalStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;

  clubs: Club[];
  setClubs: (clubs: Club[]) => void;

  clientMode: ClientMode;
  setClientMode: (clientMode: ClientMode) => void;

  preMode: PreMode;
  setPreMode: (preMode: PreMode) => void;
}

const useGeneralStore = create<generalStore>((set) => ({
  categories: [],
  setCategories: (categories: Category[]) => set({ categories }),

  clubs: [],
  setClubs: (clubs: Club[]) => set({ clubs }),

  clientMode: ClientMode.general,
  setClientMode: (clientMode: ClientMode) => set({ clientMode }),

  preMode: PreMode.none,
  setPreMode: (preMode: PreMode) => set({ preMode }),

}));

export default useGeneralStore;
