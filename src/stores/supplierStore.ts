import { create } from 'zustand';
import { Supplier } from '@/types/types';

interface SupplierStore {
  supplier: Supplier | null; 
  setSupplier: (supplier: Supplier | null) => void; 
}

const useSupplierStore = create<SupplierStore>((set) => ({
  supplier: null, 
  setSupplier: (supplier) => set({ supplier }),
}));

export default useSupplierStore;
