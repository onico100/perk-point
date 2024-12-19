"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGeneralStore from "@/stores/generalStore";
import { getAllCategories } from "@/services/categoriesService";
import { addClub, getAllClubs, updateClubById } from "@/services/clubsService";
import { Club } from "@/types/types";
import { errorAlert, inProccesAlert, successAlert } from "@/utils/sweet-alerts";

export const useFetchGeneral = () => {
  const setCategories = useGeneralStore((state: any) => state.setCategories);
  const setClubs = useGeneralStore((state: any) => state.setClubs);
  const queryClient = useQueryClient();
  const { clubs } = useGeneralStore();

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isFetching: isFetchingCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const categories = await getAllCategories();
      setCategories(categories);
      return categories;
    },
    staleTime: 600000, // Cache for 10 minutes
  });

  // Fetch clubs
  const { data: clubsData, isLoading: isClubsLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const clubs = await getAllClubs();
      setClubs(clubs);
      return clubs;
    },
    staleTime: 600000, // Cache for 10 minutes
  });

  // Add a club mutation
  const addClubMutation = useMutation({
    mutationFn: addClub,
    onMutate: async (newClub: Club) => {
      const previousClubs = [...clubs];
      const tempClub = { ...newClub, _id: "temp-id" };
      const updatedClubs = [...clubs, tempClub];
      setClubs(updatedClubs);
      queryClient.setQueryData<Club[]>(["clubs"], updatedClubs);
      inProccesAlert("מוסיף...");
      return { previousClubs };
    },
    onSuccess: (addedClubId) => {
      const parsedId = JSON.parse(JSON.stringify(addedClubId)).insertedId;
      const updatedClubs = clubs.map((club) =>
        club._id === "temp-id" ? { ...club, _id: parsedId } : club
      );
      setClubs(updatedClubs);
      queryClient.setQueryData<Club[]>(["clubs"], updatedClubs);
      successAlert("המועדון נוסף בהצלחה!");
    },
    onError: (error, _, context: any) => {
      if (context?.previousClubs) {
        setClubs(context.previousClubs);
      }
      errorAlert(`הוספת הטבה נכשלה: ${error?.message || "שגיאה לא ידועה"}`);
    },
  });

  const updateClubMutation = useMutation<
    Club,
    Error,
    { id: string; updatedData: Partial<Club> }
  >({
    mutationFn: ({ id, updatedData }) => updateClubById(id, updatedData),

    onMutate: async ({ id, updatedData }) => {
      await queryClient.cancelQueries({ queryKey: ["clubs"] });
      const previousClubs = [...clubs];

      queryClient.setQueryData<Club[]>(["clubs"], (oldClubs) =>
        oldClubs
          ? oldClubs.map((club) =>
              club._id === id ? { ...club, ...updatedData } : club
            )
          : []
      );
      inProccesAlert("מעדכן...");
      return { previousClubs };
    },
    onSuccess: (_error, _data, context) => {
      successAlert("מועדון עודכן בהצלחה!");
    },
    onError: (_error, _data, context) => {
      errorAlert("עדכון מועדון נכשל");
    },
  });

  return {
    categories: categoriesData,
    clubs: clubsData,
    isLoadingCategories: isCategoriesLoading,
    isFetchingCategories: isFetchingCategories,
    isLoadingClubs: isClubsLoading,
    addClub: addClubMutation,
    updateClub: updateClubMutation,
  };
};
