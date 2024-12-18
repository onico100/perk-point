import { create } from "zustand";

interface FilterState {
    filters: {
        supplierFilter: string;
        selectedClubs: string[];
        selectedCategories: string[];
        branchFilter: string;
        expirationStart: Date | null;
        expirationEnd: Date | null;
    };
    setFilters: (newFilters: Partial<FilterState["filters"]>) => void;
    resetFilters: () => void;
    isBenefitDetailPage: boolean;
    setBenefitDetailPage: (value: boolean) => void;
}

const useFilterStore = create<FilterState>((set) => ({
    filters: {
        supplierFilter: "",
        selectedClubs: [],
        selectedCategories: [],
        branchFilter: "",
        expirationStart: null,
        expirationEnd: null,
    },
    setFilters: (newFilters) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        })),
    resetFilters: () =>
        set({
            filters: {
                supplierFilter: "",
                selectedClubs: [],
                selectedCategories: [],
                branchFilter: "",
                expirationStart: null,
                expirationEnd: null,
            },
        }),
        isBenefitDetailPage: false,
        setBenefitDetailPage: (value) => set({ isBenefitDetailPage: value }),
    
}));

export default useFilterStore;
