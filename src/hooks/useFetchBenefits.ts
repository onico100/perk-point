"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBenefitStore } from "@/stores/benefitsStore";
import { Benefit } from "@/types/types";
import {
  getAllBenefits,
  addBenefit,
  deleteBenefitById,
  updateBenefitById,
} from "@/services/benefitsServices";
import { successAlert, inProccesAlert, errorAlert } from "@/utils/sweet-alerts";

export const useFetchBenefits = () => {
  const setBenefits = useBenefitStore((state: any) => state.setBenefits);
  const { benefits } = useBenefitStore();
  const queryClient = useQueryClient();

  // Fetch all benefits
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["benefits"],
    queryFn: async () => {
      const benefits = await getAllBenefits();
      setBenefits(benefits);
      return benefits;
    },
    staleTime: 600000,
  });

  // Add new benefit
  const addBenefitMutation = useMutation({
    mutationFn: addBenefit,
    onMutate: async (newBenefit: Benefit) => {
      const { benefits } = useBenefitStore.getState();
      const previousBenefits = [...benefits];
      const tempBenefit = { ...newBenefit, _id: "temp-id" };
      let updatedBenefits = [...benefits, tempBenefit];
      setBenefits(updatedBenefits);
      queryClient.setQueryData<Benefit[]>(["benefits"], updatedBenefits);
      //setBenefits(updatedBenefits);
      inProccesAlert("מוסיף...");
      return { previousBenefits };
    },
    onSuccess: (addedBenefitId) => {
      const Updateid: string = JSON.stringify(addedBenefitId);
      const parsedId = JSON.parse(Updateid).insertedId;

      const updateBenefits = [...benefits];
      updateBenefits.forEach((b, index) => {
        if (b._id === "temp-id") {
          updateBenefits[index] = { ...updateBenefits[index], _id: parsedId };
          console.log(888, "Updated", updateBenefits[index]);
        }
      });

      setBenefits(updateBenefits);
      queryClient.setQueryData<Benefit[]>(["benefits"], updateBenefits);
      console.log(8888, updateBenefits);
      setBenefits(updateBenefits);

      successAlert("הטבה נוספה בהצלחה!");
    },
    onError: (error, _, context: any) => {
      if (context?.previousBenefits) {
        setBenefits(context.previousBenefits);
      }
      errorAlert("הוספת הטבה נכשלה.");
    },
  });

  const updateBenefitMutation = useMutation<
    Benefit,
    Error,
    { id: string; updatedData: Partial<Benefit> }
  >({
    mutationFn: ({ id, updatedData }) => updateBenefitById(id, updatedData),

    onMutate: async ({ id, updatedData }) => {
      await queryClient.cancelQueries({ queryKey: ["benefits"] });
      const { benefits, setBenefits } = useBenefitStore.getState();
      const previousBenefits = [...benefits];

      queryClient.setQueryData<Benefit[]>(["benefits"], (oldBenefits) =>
        oldBenefits
          ? oldBenefits.map((benefit) =>
              benefit._id === id ? { ...benefit, ...updatedData } : benefit
            )
          : []
      );
      inProccesAlert("מעדכן...");
      return { previousBenefits };
    },
    onSuccess: (_error, _data, context) => {
      successAlert("הטבה עודכנה בהצלחה!");
    },
    onError: (_error, _data, context) => {
      errorAlert("עדכון הטבה נכשל");
    },
  });

  // Delete benefit
  const deleteBenefitMutation = useMutation({
    mutationFn: deleteBenefitById,
    onMutate: async (benefitId: string) => {
      await queryClient.cancelQueries({ queryKey: ["benefits"] });
      const { benefits } = useBenefitStore.getState();
      const previousBenefits = [...benefits];
      const updatedBenefits = benefits.filter(
        (benefit) => benefit._id !== benefitId
      );
      console.log(benefitId);
      console.log(benefits);
      console.log(updatedBenefits);
      setBenefits(updatedBenefits);
      queryClient.setQueryData<Benefit[]>(["benefits"], updatedBenefits);
      inProccesAlert("מוחק...");
      return { previousBenefits };
    },
    onSuccess: async () => {
      successAlert("הטבה נמחקה בהצלחה!");
    },
    onError: (_error, _variables, context: any) => {
      const { setBenefits } = useBenefitStore.getState();
      setBenefits(context.previousBenefits);
      errorAlert("מחיקת הטבה נכשלה.");
    },
  });

  return {
    benefits: data,
    isLoadingB: isLoading,
    isFetchingB: isFetching,
    addBenefit: addBenefitMutation.mutate,
    updateBenefit: updateBenefitMutation.mutate,
    deleteBenefit: deleteBenefitMutation.mutate,
  };
};
