"use client"

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
    mutationFn: (newBenefit: Omit<Benefit, "_id">) => {
      const validBenefit: Omit<Benefit, "_id"> = {
        supplierId: newBenefit.supplierId || "defaultSupplierId",
        clubId: newBenefit.clubId || "defaultClubId",
        redemptionConditions: newBenefit.redemptionConditions || "",
        description: newBenefit.description || "",
        expirationDate: newBenefit.expirationDate || new Date(),
        branches: newBenefit.branches || [],
        isActive: newBenefit.isActive !== undefined ? newBenefit.isActive : true,
      };
      return addBenefit(validBenefit); // Ensure valid data is sent to the API
    },
    onMutate: async (newBenefit: Omit<Benefit, "_id">) => {
      const { benefits, setBenefits } = useBenefitStore.getState();
      const previousBenefits = [...benefits];
      const tempBenefit = { ...newBenefit, _id: "temp-id" };
      setBenefits([...benefits, tempBenefit]);
      return { previousBenefits };
    },
    onError: (_error, _variables, context: any) => {
      const { setBenefits } = useBenefitStore.getState();
      setBenefits(context.previousBenefits)
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['benefits'] }) },
  });

  const updateBenefitMutation = useMutation<
    Benefit,
    Error,
    { id: string; updatedData: Partial<Benefit> },
    { previousBenefits: Benefit[] }
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
      queryClient.setQueryData<Benefit[]>(["benefits"], context?.previousBenefits);
    },

  });



  // Delete benefit
  //was
  // const deleteBenefitMutation = useMutation({
  //   mutationFn: deleteBenefitById,
  //   onMutate: async (benefitId: string) => {
  //     const { benefits, setBenefits } = useBenefitStore.getState();
  //     const previousBenefits = [...benefits];
  //     const updatedBenefits = benefits.filter((benefit) => benefit._id !== benefitId);
  //     setBenefits(updatedBenefits);
  //     return { previousBenefits };
  //   },
  //   onError: (_error, _variables, context: any) => {
  //     const { setBenefits } = useBenefitStore.getState();
  //     setBenefits(context.previousBenefits);
  //   },
  //   onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['benefits'] }) },
  // });

  const deleteBenefitMutation = useMutation({
    mutationFn: deleteBenefitById,
    onMutate: async (benefitId: string) => {

      await queryClient.cancelQueries({ queryKey: ["benefits"] });
      const { benefits, setBenefits } = useBenefitStore.getState();
      const previousBenefits = [...benefits];

      queryClient.setQueryData<Benefit[]>(["benefits"], (oldBenefits) =>
        oldBenefits
          ? oldBenefits.filter((benefit) =>
            benefit._id !== benefitId 
          ): []
      );

      return { previousBenefits };
    },
    onError: (_error, _variables, context: any) => {
      queryClient.setQueryData(["benefits"], context?.previousBenefits);
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
