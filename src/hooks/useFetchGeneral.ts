"use client"

import { useQuery } from "@tanstack/react-query";
import useGeneralStore from "@/stores/generalStore";
import { getAllCategories } from "@/services/categoriesService";
import { getAllClubs } from "@/services/clubsService";

export const useFetchGeneral = () => {
  const setCategories = useGeneralStore((state: any) => state.setCategories);
  const setClubs = useGeneralStore((state: any) => state.setClubs);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["generalStore"],
    queryFn: async () => {
      const categories = await getAllCategories();
      setCategories(categories);
      const clubs = await getAllClubs();
      setClubs(clubs);
      return { categories, clubs };
    },
    staleTime: 600000,
  });

  return {
    categories: data?.categories,
    clubs: data?.clubs,
    isLoadingCategories: isLoading,
    isFetchingCategories: isFetching,
  };
};
