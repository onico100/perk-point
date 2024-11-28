import { create } from 'zustand';
import { Supplier } from '@/types/types';

interface SupplierStore {
  suppliers: Supplier[]
  setSuppliers: (suppliers: Supplier[]) => void; 
}

const useSupplierStore = create<SupplierStore>((set) => ({
  suppliers:[], 
  setSuppliers: (suppliers: Supplier[]) => set({ suppliers }),
}));

export default useSupplierStore;
