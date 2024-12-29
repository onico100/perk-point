"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBenefitStore } from "@/stores/benefitsStore";
import { Benefit } from "@/types/BenefitsTypes";
import {
  //getAllBenefits,
  addBenefit,
  deleteBenefitById,
  updateBenefitById,
  getAllBenefitsFormAll,
} from "@/services/benefitsServices";
import { successAlert, inProccesAlert, errorAlert } from "@/utils/sweet-alerts";

export const useFetchBenefits = () => {
  const setBenefits = useBenefitStore((state: any) => state.setBenefits);
  const { benefits } = useBenefitStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["benefits"],
    queryFn: async () => {
      const benefits = await getAllBenefitsFormAll();
      setBenefits(benefits);
      return benefits;
    },
    staleTime: 600000,
  });

  const addBenefitMutation = useMutation({
    mutationFn: addBenefit,
    onMutate: async (newBenefit: Benefit) => {
      const { benefits } = useBenefitStore.getState();
      const previousBenefits = [...benefits];
      const tempBenefit = { ...newBenefit, _id: "temp-id" };
      let updatedBenefits = [...benefits, tempBenefit];
      setBenefits(updatedBenefits);
      queryClient.setQueryData<Benefit[]>(["benefits"], updatedBenefits);
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
        }
      });

      setBenefits(updateBenefits);
      queryClient.setQueryData<Benefit[]>(["benefits"], updateBenefits);
      setBenefits(updateBenefits);

      successAlert("הטבה נוספה בהצלחה!");
    },
    onError: (error, _, context: any) => {
      if (context?.previousBenefits) {
        setBenefits(context.previousBenefits.filter((b: Benefit) => b._id !== "temp-id"));
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

  const deleteBenefitMutation = useMutation({
    mutationFn: deleteBenefitById,
    onMutate: async (benefitId: string) => {
      await queryClient.cancelQueries({ queryKey: ["benefits"] });
      const { benefits } = useBenefitStore.getState();
      const previousBenefits = [...benefits];
      const updatedBenefits = benefits.filter(
        (benefit) => benefit._id !== benefitId
      );
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
