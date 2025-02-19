import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Category, ClientMode, User } from "@/types/Generaltypes";
import { Club } from "@/types/ClubTypes";
import { Supplier } from "@/types/SupplierTypes";

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
      setCurrentUser: (user: User | null) => set({ currentUser: user }),

      currentSupplier: null,
      setCurrentSupplier: (supplier: Supplier | null) =>
        set({ currentSupplier: supplier }),
    }),
    {
      name: "general-store",
    }
  )
);

export default useGeneralStore;
