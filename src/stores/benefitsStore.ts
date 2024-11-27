import { create } from 'zustand';
import { Benefit } from '@/types/types';

interface BenefitStore {
  benefits: Benefit[]; 
  setBenefits: (benefits: Benefit[]) => void; 
}

const useBenefitStore = create<BenefitStore>((set) => ({
  benefits: [], 
  setBenefits: (benefits: Benefit[]) => set({ benefits }),
}));

export default useBenefitStore;
