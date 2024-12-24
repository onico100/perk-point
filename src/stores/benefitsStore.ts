import { create } from "zustand";
import { Benefit } from "@/types/BenefitsTypes";
import { persist } from "zustand/middleware";

interface BenefitStore {
  benefits: Benefit[];
  setBenefits: (benefits: Benefit[]) => void;
}

export const useBenefitStore = create<BenefitStore>()(
  persist(
    (set) => ({
      benefits: [],
      setBenefits: (benefits: Benefit[]) => set({ benefits }),
    }),
    {
      name: "benefits-storage",
    }
  )
);
