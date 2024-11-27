import { useQuery } from "@tanstack/react-query";
import useSupplierStore from "@/stores/supplierStore";
import { Supplier } from "@/types/types";
import { useMutation, useQueryClient } from "react-query";
import {
  getAllSuppliers,
  addSupplier,
  deleteSupplierById,
  updateSupplierById,
  getSupplierById,
} from "@/services/suppliersServices";

export const useFetchSupplier = (id:string) => {
  const setSupplier = useSupplierStore((state: any) => state.setSupplier);

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["suppliers", id],
    queryFn: async () => {
      const supplier = await getSupplierById(id);
      setSupplier(supplier);
      return supplier;
    },
    staleTime: 10000,
  });

  const addSupplierMutation = useMutation({
    mutationFn: addSupplier,
    onMutate: async (nSupplier: Omit<Supplier, "_id">) => {
      const { supplier, setSupplier } = useSupplierStore.getState();

      const newSupplier = { ...nSupplier, _id: "temp-id" };
      setSupplier( newSupplier);

      return { supplier };
    },
    onError: (error, _, context: any) => {
      const { setSupplier } = useSupplierStore.getState();

      setSupplier(context.previousSupplier);
    },
    onSuccess: () => {
      console.log("Supplier added successfully!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const updateSupplierMutation = useMutation<
    Supplier,
    Error,
    { id: string; updatedData: Partial<Supplier> }
  >({
    mutationFn: ({ id, updatedData }) => updateSupplierById(id, updatedData),
    onMutate: async ({ id, updatedData }) => {
      const { supplier, setSupplier } = useSupplierStore.getState();
      
      const updatedSupplier: Supplier = { ...supplier, _id: id, ...updatedData } as Supplier;
      setSupplier(updatedSupplier);

      return { supplier };
    },
    onError: (_error, _variables, context: any) => {
      console.log("Error context:", context);
      const { setSupplier } = useSupplierStore.getState();

      if (context?.supplier) {
        setSupplier(context.supplier);
      }
    },
    onSuccess: () => {
      console.log("Supplier updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  return {
    suppliers: data,
    isLoading,
    isFetching,
    addSupplier: addSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
  };
};
