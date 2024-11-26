import { useQuery } from "@tanstack/react-query";
import useSupplierStore from "@/stores/suppliersStore";
import { Supplier } from "@/types/types";
import { useIsMutating, useMutation, useQueryClient } from "react-query";
import {
  getAllSuppliers,
  addSupplier,
  deleteSupplierById,
  updateSupplierById,
} from "@/services/suppliersServices";

export const useFetchSuppliers = () => {
  const setSuppliers = useSupplierStore((state: any) => state.setSuppliers);

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
    onMutate: async (supplier: Omit<Supplier, "_id">) => {
      const { suppliers, setSuppliers } = useSupplierStore.getState();

      const previousSuppliers = [...suppliers];

      const newSupplier = { ...supplier, _id: "temp-id" };
      setSuppliers([...suppliers, newSupplier]);

      return { previousSuppliers };
    },
    onError: (error, _, context: any) => {
      const { setSuppliers } = useSupplierStore.getState();

      setSuppliers(context.previousSuppliers);
    },
    onSuccess: () => {
      console.log("Supplier added successfully!");
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  });

  const updateSupplierMutation = useMutation<
    Supplier,
    Error,
    { id: string; updatedData: Partial<Supplier> }
  >({
    mutationFn: ({ id, updatedData }) => updateSupplierById(id, updatedData),
    onMutate: async ({ id, updatedData }) => {
      const { suppliers, setSuppliers } = useSupplierStore.getState();

      const previousSuppliers = [...suppliers];

      const updatedSuppliers = suppliers.map((supplier) =>
        supplier._id === id ? { ...supplier, ...updatedData } : supplier
      );
      setSuppliers(updatedSuppliers);

      return { previousSuppliers };
    },
    onError: (_error, _variables, context: any) => {
      const { setSuppliers } = useSupplierStore.getState();

      setSuppliers(context.previousSuppliers);
    },
    onSuccess: () => {
      console.log("Supplier updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: deleteSupplierById,
    onMutate: async (supplierId: string) => {
      const { suppliers, setSuppliers } = useSupplierStore.getState();

      const previousSuppliers = [...suppliers];

      const updatedSuppliers = suppliers.filter(
        (supplier) => supplier._id !== supplierId
      );
      setSuppliers(updatedSuppliers);

      return { previousSuppliers };
    },
    onError: (error, _, context: any) => {
      const { setSuppliers } = useSupplierStore.getState();

      setSuppliers(context.previousSuppliers);
    },
    onSuccess: () => {
      console.log("Supplier deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  });

  return {
    suppliers: data,
    isLoading,
    isFetching,
    addSupplier: addSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    deleteSupplier: deleteSupplierMutation.mutate,
  };
};
