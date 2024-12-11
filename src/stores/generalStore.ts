import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Category,
  Club,
  ClientMode,
  User,
  Supplier,
 // Branch,
} from "@/types/types";

interface GeneralStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;

  clubs: Club[];
  setClubs: (clubs: Club[]) => void;

  clientMode: ClientMode;
  setClientMode: (clientMode: ClientMode) => void;

  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  currentSupplier: Supplier | null;
  setCurrentSupplier: (supplier: Supplier | null) => void;

  // supplierBranches: string[];
  // setSupplierBranches: (branches: string[]) => void;
}

const useGeneralStore = create<GeneralStore>()(
  persist(
    (set) => ({
      categories: [],
      setCategories: (categories: Category[]) => set({ categories }),

      clubs: [],
      setClubs: (clubs: Club[]) => set({ clubs }),

      clientMode: ClientMode.general,
      setClientMode: (clientMode: ClientMode) => set({ clientMode }),

      currentUser: null,
      setCurrentUser: (user: User | null) => 
        set({ currentUser: user }),

      currentSupplier: null,
      setCurrentSupplier: (supplier: Supplier | null) =>
        set({ currentSupplier: supplier }),

      // supplierBranches: [],
      // setSupplierBranches: (supplierBranches: string[]) => set({ supplierBranches }),
    }),
    {
      name: "general-store",
    }
  )
);

export default useGeneralStore;
