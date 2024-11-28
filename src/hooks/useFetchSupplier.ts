"use client";

import { useQuery } from "@tanstack/react-query";
import useSuppliersStore from "@/stores/suppliersStore";
import { ClientMode, Supplier } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGeneralStore from "@/stores/generalStore"; 

import {
  getAllSuppliers,
  addSupplier,
  updateSupplierById,
  getSupplierByCredentials,
} from "@/services/suppliersServices";


export const useFetchSupplier = (id:string) => {
  const setCurrentSupplier = useGeneralStore.getState().setCurrentSupplier;
  const currentSupplier= useGeneralStore.getState().currentSupplier;
  //const setSupplier = useSupplierStore((state: any) => state.setSupplier);
  const { setSuppliers } = useSuppliersStore.getState();
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const supplier = await getSupplierById(id);
      setCurrentSupplier(supplier);
      //setSupplier(supplier);
      return supplier;
    },
    staleTime: 10000,
  });

  const addSupplierMutation = useMutation({
    mutationFn: addSupplier,
    onMutate: async (nSupplier: Omit<Supplier, "_id">) => {
      //const { supplier, setSupplier } = useSupplierStore.getState();
      const newSupplier = { ...nSupplier, _id: "temp-id" };
      setCurrentSupplier( newSupplier);
      //setSupplier( newSupplier);
      return { currentSupplier };
    },
    onError: (error, _, context: any) => {
      setCurrentSupplier(context.previousSupplier);
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
      const updatedSupplier: Supplier = { ...currentSupplier, _id: id, ...updatedData } as Supplier;
      setCurrentSupplier
      return { updatedSupplier };
    },
    onError: (_error, _variables, context: any) => {
      console.log("Error context:", context);
      if (context?.supplier) {setCurrentSupplier(context.supplier);}
    },
    onSuccess: () => {
      console.log("Supplier updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const loginSupplierMutation = useMutation<Supplier, Error, { email: string; password: string }>({
    mutationFn:({ email, password }) => getSupplierByCredentials(email, password),
    onSuccess: (supplier) => {
      console.log("Supplier login successful:", supplier);

      // General Zustand Updating
      const setClientMode= useGeneralStore.getState().setClientMode;
      alert(`Welcome, ${supplier.providerName}!`);
      setClientMode(ClientMode.supplier);
      setCurrentSupplier(supplier);
      console.log("general zustand current Supplier", currentSupplier)
    },
    onError: (error) => {
      console.error("Hello Supplier login failed:", error);
    },
  });

  return {
    suppliers: data,
    isLoading,
    isFetching,
    addSupplier: addSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    loginSupplier: loginSupplierMutation.mutate,
  };
};

