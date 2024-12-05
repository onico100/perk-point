import { useQuery } from "@tanstack/react-query";
import useSupplierStore from "@/stores/suppliersStore";
import { ClientMode, Supplier } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSuppliers,
  addSupplier,
  updateSupplierById,
  getSupplierByCredentials,
} from "@/services/suppliersServices";
import useGeneralStore from "@/stores/generalStore";
export const useFetchSuppliers = () => {
  const { setSuppliers } = useSupplierStore.getState();
  const setClientMode = useGeneralStore.getState().setClientMode;
  const setCurrentSupplier = useGeneralStore.getState().setCurrentSupplier;
  const currentSupplier = useGeneralStore.getState().currentSupplier;

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const suppliers = await getAllSuppliers();
      setSuppliers(suppliers);
      return suppliers;
    },
    staleTime: 10000,
  });


const addSupplierMutation = useMutation({
  mutationFn: addSupplier,
  onMutate: async (nSupplier: Supplier) => {
    const { suppliers } = useSupplierStore.getState();
    const newSupplier = { ...nSupplier, _id: "temp-id" };
    const existingSupplier = suppliers.find(
      (s) => s.email === nSupplier.email
    );
    if (!existingSupplier) {
      setSuppliers([...suppliers, newSupplier]);
    }
    return { previousSuppliers: suppliers };
  },
  onError: (error, _, context: any) => {
    if (context?.previousSuppliers) {
      const { setSuppliers } = useSupplierStore.getState();
      setSuppliers(context.previousSuppliers);
    }
  },
  onSuccess: (supplier) => {
    setCurrentSupplier(supplier); 
    setClientMode(ClientMode.supplier);
   // queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    console.log("Supplier added and stored successfully!", currentSupplier);
  },
});

  const updateSupplierMutation = useMutation<
    Supplier,
    Error,
    { id: string; updatedData: Partial<Supplier> }
  >({
    mutationFn: ({ id, updatedData }) => updateSupplierById(id, updatedData),
    onMutate: async ({ id, updatedData }) => {
      const { suppliers } = useSupplierStore.getState();
      const updatedSupplier: Supplier = {
        ...suppliers.find((s) => s._id === id),
        ...updatedData,
      } as Supplier;
      setSuppliers(suppliers.map((s) => (s._id === id ? updatedSupplier : s)));
      return { previousSuppliers: suppliers };
    },
    onError: (_error, _variables, context: any) => {
      setSuppliers(context.previousSuppliers);
      console.error("Failed to update supplier.");
    },
    onSuccess: () => {
      console.log("Supplier updated successfully!");
     // queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const loginSupplierMutation = useMutation<
    Supplier,
    Error,
    { email: string; password: string }
  >({
  mutationFn: ({ email, password }) =>
    getSupplierByCredentials(email, password),
  onSuccess: (supplier) => {
      const setCurrentSupplier = useGeneralStore.getState().setCurrentSupplier;
      const setClientMode = useGeneralStore.getState().setClientMode;
      setClientMode(ClientMode.supplier);
      setCurrentSupplier(supplier);
    },
    onError: (error) => {
      console.error("Supplier login failed:", error);
      alert("Invalid supplier credentials.");
    },
  });

  return {
    suppliers: data,
    isLoadingS: isLoading,
    isFetchingS: isFetching,
    addSupplier: addSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    loginSupplier: loginSupplierMutation.mutate,
  };
};
