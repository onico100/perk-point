import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useBenefitStore from "@/stores/benefitsStore";
import { Benefit } from "@/types/types";
import {
  getAllBenefits,
  addBenefit,
  deleteBenefitById,
  updateBenefitById,
} from "@/services/benefitsServices";


export const useFetchBenefits = () => {
  const setBenefits = useBenefitStore((state) => state.setBenefits); // Zustand setter
 console.log("14")
  const queryClient = useQueryClient();
  console.log("16")
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['benefits'] })},
  });

  // Update benefit
  const updateBenefitMutation = useMutation<
    Benefit,
    Error,
    { id: string; updatedData: Partial<Benefit> }
  >({
    mutationFn: ({ id, updatedData }) => {
      const validData: Benefit = {
        ...updatedData,
        _id: id,
        supplierId: updatedData.supplierId || "defaultSupplierId",
        clubId: updatedData.clubId || "defaultClubId",
        redemptionConditions: updatedData.redemptionConditions || "",
        description: updatedData.description || "",
        expirationDate: updatedData.expirationDate || new Date(),
        branches: updatedData.branches || [],
        isActive: updatedData.isActive !== undefined ? updatedData.isActive : true,
      };
      return updateBenefitById(id, validData);
    },
    onMutate: async ({ id, updatedData }) => {
      const { benefits, setBenefits } = useBenefitStore.getState();
      const previousBenefits = [...benefits];
      const updatedBenefits = benefits.map((benefit) => benefit._id === id ? { ...benefit, ...updatedData } : benefit);
      setBenefits(updatedBenefits);
      return { previousBenefits };
    },
    onError: (_error, _variables, context: any) => {
      const { setBenefits } = useBenefitStore.getState();
      setBenefits(context.previousBenefits); // Revert to previous state
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['benefits'] })},
  });

  // Delete benefit
  const deleteBenefitMutation = useMutation({
    mutationFn: deleteBenefitById,
    onMutate: async (benefitId: string) => {
      const { benefits, setBenefits } = useBenefitStore.getState();
      const previousBenefits = [...benefits];
      const updatedBenefits = benefits.filter((benefit) => benefit._id !== benefitId);
      setBenefits(updatedBenefits);
      return { previousBenefits };
    },
    onError: (_error, _variables, context: any) => {
      const { setBenefits } = useBenefitStore.getState();
      setBenefits(context.previousBenefits);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['benefits'] })},
  });

  return {
    benefits: data,
    isLoading,
    isFetching,
    addBenefit: addBenefitMutation.mutate,
    updateBenefit: updateBenefitMutation.mutate,
    deleteBenefit: deleteBenefitMutation.mutate,
  };
};
