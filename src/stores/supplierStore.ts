import { create } from 'zustand';
import { Supplier } from '@/types/types';

interface SupplierStore {
  supplier: Supplier | null; 
  suppliers: Supplier[]
  setSupplier: (supplier: Supplier | null) => void; 
  setSuppliers: (suppliers: Supplier[]) => void; 
}

const useSupplierStore = create<SupplierStore>((set) => ({
  supplier: null,
  suppliers:[], 
  setSupplier: (supplier) => set({ supplier }),
  setSuppliers: (suppliers: Supplier[]) => set({ suppliers }),
}));

export default useSupplierStore;
