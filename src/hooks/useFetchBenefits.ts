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

export const useFetchBenefits = () => {
  const setBenefits = useBenefitStore((state: any) => state.setBenefits); // Zustand setter

  const queryClient = useQueryClient();

  // Fetch all benefits
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["benefits"],
    queryFn: async () => {
      const benefits = await getAllBenefits();
      setBenefits(benefits);
      return benefits;
    },
    staleTime: 10000,
  });

  // Add new benefit
  const addBenefitMutation = useMutation({
    mutationFn: addBenefit,
    onMutate: async (newBenefit: Benefit) => {
      const { benefits } = useBenefitStore.getState();
      const previousBenefits = [...benefits];
      const tempBenefit = { ...newBenefit, _id: "temp-id" };
      setBenefits([...benefits, tempBenefit]);
      return { previousBenefits };
    },
    onSuccess: () => {
      alert("benefit added successfully")
      // queryClient.invalidateQueries({ queryKey: ["benefits"] });
    },
    onError: (error, _, context: any) => {
      if (context?.previousBenefits) {
        setBenefits(context.previousBenefits);
      }
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

      return { previousBenefits };
    },
    onError: (_error, _data, context) => {
      //queryClient.setQueryData<Benefit[]>(["benefits"], context?.previousBenefits);
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
      queryClient.setQueryData<Benefit[]>(["benefits"], updatedBenefits);
      return { previousBenefits };
    },

    onError: (_error, _variables, context: any) => {
      const { setBenefits } = useBenefitStore.getState();
      setBenefits(context.previousBenefits);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["benefits"] });
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
