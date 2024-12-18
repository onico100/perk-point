import { create } from "zustand";

interface FilterState {
    filtersMain: {
        supplierFilter: string;
        selectedClubs: string[];
        selectedCategories: string[];
        branchFilter: string;
        expirationStart: Date | null;
        expirationEnd: Date | null;
    };
    filtersPersenal: {
        supplierFilter: string;
        selectedClubs: string[];
        selectedCategories: string[];
        branchFilter: string;
        expirationStart: Date | null;
        expirationEnd: Date | null;
    };
    setFiltersMain: (newFilters: Partial<FilterState["filtersMain"]>) => void;
    resetFiltersMain: () => void;
    setFiltersPersenal: (newFilters: Partial<FilterState["filtersPersenal"]>) => void;
    resetFiltersPersenal: () => void;
    isBenefitDetailPage: boolean;
    setBenefitDetailPage: (value: boolean) => void;
}

const useFilterStore = create<FilterState>((set) => ({
    filtersMain: {
        supplierFilter: "",
        selectedClubs: [],
        selectedCategories: [],
        branchFilter: "",
        expirationStart: null,
        expirationEnd: null,
    },
    filtersPersenal: {
        supplierFilter: "",
        selectedClubs: [],
        selectedCategories: [],
        branchFilter: "",
        expirationStart: null,
        expirationEnd: null,
    },
    setFiltersMain: (newFilters) =>
        set((state) => ({
            filtersMain: { ...state.filtersMain, ...newFilters },
        })),
    resetFiltersMain: () =>
        set({
            filtersMain: {
                supplierFilter: "",
                selectedClubs: [],
                selectedCategories: [],
                branchFilter: "",
                expirationStart: null,
                expirationEnd: null,
            },
        }),
    setFiltersPersenal: (newFilters) =>
        set((state) => ({
            filtersPersenal: { ...state.filtersPersenal, ...newFilters },
        })),
    resetFiltersPersenal: () =>
        set({
            filtersPersenal: {
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
