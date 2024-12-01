import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Supplier } from "@/types/types";

interface SupplierStore {
  suppliers: Supplier[];
  setSuppliers: (suppliers: Supplier[]) => void;
}

const useSupplierStore = create<SupplierStore>()(
  persist(
    (set) => ({
      suppliers: [],
      setSuppliers: (suppliers: Supplier[]) => set({ suppliers }),
    }),
    {
      name: "supplier-store", 
    }
  )
);

export default useSupplierStore;
