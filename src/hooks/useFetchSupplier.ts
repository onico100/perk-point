import { useQuery } from "@tanstack/react-query";
import useSupplierStore from "@/stores/supplierStore";
import { Supplier } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSuppliers,
  addSupplier,
  deleteSupplierById,
  updateSupplierById,
  getSupplierById,
  getSupplierByCredentials,
} from "@/services/suppliersServices";
import useGeneralStore from "@/stores/generalStore";

export const useFetchSupplier = (id:string) => {

  const setSupplier = useSupplierStore((state: any) => state.setSupplier);

  const queryClient = useQueryClient();

  console.log("useFetchSupplier id: ",id); 

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["suppliers", id],
    queryFn: async () => {
      const supplier = await getSupplierById(id);
      setSupplier(supplier);
      return supplier;
    },
    staleTime: 10000,
  });

  console.log(" 2 useFetchSupplier id: ",id); 
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

  const loginSupplierMutation = useMutation<Supplier, Error, { email: string; password: string }>({
    mutationFn:({ email, password }) => getSupplierByCredentials(email, password),
    onSuccess: (supplier) => {
      console.log("Supplier login successful:", supplier);
      // General Zustand Updating
      const setCurrentSupplier = useGeneralStore.getState().setCurrentSupplier;
      setCurrentSupplier(supplier);
      alert(`Welcome, ${supplier.providerName}!`);
    },
    onError: (error) => {
      console.error("Hello Supplier login failed:", error);
      alert("Invalid supplier credentials.");
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

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import useSupplierStore from "@/stores/supplierStore";
// import { Supplier } from "@/types/types";
// import useGeneralStore from "@/stores/generalStore";
// //import { useIsMutating, useMutation, useQueryClient } from "react-query";

// import {
//   getAllSuppliers,
//   addSupplier,
//   deleteSupplierById,
//   updateSupplierById,
//   getSupplierByCredentials,
// } from "@/services/suppliersServices";

// export const useFetchSuppliers = () => {
//   const setSuppliers = useSupplierStore((state: any) => state.setSuppliers);
//   const queryClient = useQueryClient();
//   const { data, isLoading, isFetching } = useQuery({
//     queryKey: ["suppliers"],
//     queryFn: async () => {
//       const suppliers = await getAllSuppliers();
//       setSuppliers(suppliers);
//       return suppliers;
//     },
//     staleTime: 10000,
//   });

//   // Login supplier by credentials
//   const loginSupplierMutation = useMutation<Supplier, Error, { email: string; password: string }>({
//     mutationFn: ({ email, password }) => getSupplierByCredentials(email, password),
//     onSuccess: (supplier) => {
//       console.log("Supplier login successful:", supplier);
//       // General Zustand Updating
//       const setCurrentSupplier = useGeneralStore.getState().setCurrentSupplier;
//       setCurrentSupplier(supplier);
//       alert(`Welcome, ${supplier.providerName}!`);
//     },
//     onError: (error) => {
//       console.error("Supplier login failed:", error);
//       alert("Invalid supplier credentials.");
//     },
//   });
  

//   const addSupplierMutation = useMutation({
//     mutationFn: addSupplier,
//     onMutate: async (supplier: Omit<Supplier, "_id">) => {
//       const { supplier, setSupplier } = useSupplierStore.getState();
//       const previousSuppliers = [...suppliers];
//       const newSupplier = { ...supplier, _id: "temp-id" };
//       setSuppliers([...suppliers, newSupplier]);
//       return { previousSuppliers };
//     },
//     onError: (error, _, context: any) => {
//       const { setSuppliers } = useSupplierStore.getState();
//       setSuppliers(context.previousSuppliers);
//     },
//     onSuccess: () => {
//       console.log("Supplier added successfully!");
//       queryClient.invalidateQueries({ queryKey: ['suppliers'] })
//     },
//   });

//   const updateSupplierMutation = useMutation<
//     Supplier,
//     Error,
//     { id: string; updatedData: Partial<Supplier> }
//   >({
//     mutationFn: ({ id, updatedData }) => updateSupplierById(id, updatedData),
//     onMutate: async ({ id, updatedData }) => {
//       const { suppliers, setSuppliers } = useSupplierStore.getState();
//       const previousSuppliers = [...suppliers];
//       const updatedSuppliers = suppliers.map((supplier) =>
//         supplier._id === id ? { ...supplier, ...updatedData } : supplier
//       );
//       setSuppliers(updatedSuppliers);
//       return { previousSuppliers };
//     },
//     onError: (_error, _variables, context: any) => {
//       const { setSuppliers } = useSupplierStore.getState();
//       setSuppliers(context.previousSuppliers);
//     },
//     onSuccess: () => {
//       console.log("Supplier updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ['suppliers'] })
//     },
//   });

//   const deleteSupplierMutation = useMutation({
//     mutationFn: deleteSupplierById,
//     onMutate: async (supplierId: string) => {
//       const { suppliers, setSuppliers } = useSupplierStore.getState();

//       const previousSuppliers = [...suppliers];

//       const updatedSuppliers = suppliers.filter(
//         (supplier) => supplier._id !== supplierId
//       );
//       setSuppliers(updatedSuppliers);

//       return { previousSuppliers };
//     },
//     onError: (error, _, context: any) => {
//       const { setSuppliers } = useSupplierStore.getState();

//       setSuppliers(context.previousSuppliers);
//     },
//     onSuccess: () => {
//       console.log("Supplier deleted successfully!");
//       queryClient.invalidateQueries({ queryKey: ['suppliers'] })
//     },
//   });

//   return {
//     suppliers: data,
//     isLoading,
//     isFetching,
//     addSupplier: addSupplierMutation.mutate,
//     updateSupplier: updateSupplierMutation.mutate,
//     deleteSupplier: deleteSupplierMutation.mutate,
//     loginSupplier: loginSupplierMutation.mutate,
//   };
// };
