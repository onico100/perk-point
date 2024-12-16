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
import { useRouter } from "next/navigation";
import { errorAlert, inProccesAlert, successAlert } from "@/utils/sweet-alerts";
export const useFetchSuppliers = () => {
  const { suppliers, setSuppliers } = useSupplierStore();
  const setClientMode = useGeneralStore.getState().setClientMode;
  const setCurrentSupplier = useGeneralStore.getState().setCurrentSupplier;
  const currentSupplier = useGeneralStore.getState().currentSupplier;

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const suppliers = await getAllSuppliers();
      setSuppliers(suppliers);
      return suppliers;
    },
    staleTime: 600000,
  });

  const addSupplierMutation = useMutation({
    mutationFn: addSupplier,
    onMutate: async (nSupplier: Supplier) => {
      console.log("addSupplierMutation newSupplier", nSupplier);

      const newSupplier = { ...nSupplier, _id: "temp-id" };
      const existingSupplier = suppliers.find(
        (s) => s.email === nSupplier.email
      );
      let previousSuppliers = [...suppliers];

      if (!existingSupplier) {
        let updatedSupplier = [...suppliers, newSupplier];
        setSuppliers(updatedSupplier);
        queryClient.setQueryData<Supplier[]>(["suppliers"], updatedSupplier);
      }
      inProccesAlert("מוסיף...");
      return { previousSuppliers: previousSuppliers };
    },
    onError: (error, _, context: any) => {
      if (context?.previousSuppliers) {
        const { setSuppliers } = useSupplierStore.getState();
        setSuppliers(context.previousSuppliers);
        errorAlert("הוספת משתמש נכשלה");
      }
    },
    onSuccess: (supplier) => {
      setCurrentSupplier(supplier);
      setClientMode(ClientMode.supplier);

      console.log(5555,supplier._id)
      console.log(5555,suppliers)
      const updateSuppliers = [...suppliers];
      updateSuppliers.forEach((s, index) => {
        if (s._id === "temp-id") {
          updateSuppliers[index] = { ...updateSuppliers[index], _id: supplier._id };
          console.log(888, "Updated", updateSuppliers[index]);
        }
      });
      
      setSuppliers(updateSuppliers);
      queryClient.setQueryData<Supplier[]>(["suppliers"], updateSuppliers);
     
      setSuppliers(updateSuppliers);

      console.log("Supplier added and stored successfully!", currentSupplier);
      successAlert("משתמש נוסף בהצלחה!");
      router.push("/");
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
      let updatedSuppliers = suppliers.map((s) =>
        s._id === id ? updatedSupplier : s
      );
      setSuppliers(updatedSuppliers);
      queryClient.setQueryData<Supplier[]>(["suppliers"], updatedSuppliers);

      let oldSupplier = currentSupplier;
      setCurrentSupplier(updatedSupplier);
      inProccesAlert("מעדכן...");
      return { previousSuppliers: suppliers, currentSupplier: oldSupplier };
    },
    onError: (_error, _variables, context: any) => {
      setSuppliers(context.previousSuppliers);
      setCurrentSupplier(context.oldSupplier);

      console.error("Failed to update supplier.");
      errorAlert("עדכון ספק נכשל");
    },
    onSuccess: () => {
      console.log("Supplier updated successfully!");
      successAlert("עדכון ספק בוצע בהצלחה!");
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
      errorAlert("פרטי הספק אינם תקינים");
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
