"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ClientMode, User } from "../types/types";
import useGeneralStore from "@/stores/generalStore";
import {
  addUser,
  updateUserById,
  deleteUserById,
  getUserById,
  getUserByCredentials,
} from "@/services/usersServices";
import { useRouter } from "next/navigation";
import { errorAlert, inProccesAlert, successAlert } from "@/utils/sweet-alerts";

const setCurrentUser = useGeneralStore.getState().setCurrentUser;
const currentUser = useGeneralStore.getState().currentUser;



// Fetch user by ID
export const useGetUserById = (id: string) => {
  return useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: async () => {
      const user = await getUserById(id);
      setCurrentUser(user);
      return user;
    },
    enabled: !!id,
    staleTime: 600000,
  });
};

// Login user by credentials
export const useLoginUser = () => {
  const router = useRouter();
  return useMutation<User, Error, { email: string; password: string }>({
    mutationFn: ({ email, password }) => getUserByCredentials(email, password),
    onSuccess: (user) => {
      const setClientMode = useGeneralStore.getState().setClientMode;
      setClientMode(ClientMode.user);
      setCurrentUser(user);
      router.push(`benefits/${user._id}`);
    },
  });
};

// Add new user
export const useAddUser = () => {
  const router = useRouter();
  return useMutation<User, Error, User>({
    mutationFn: addUser,
    onSuccess: (user) => {
      console.log("user added", user);
      const setClientMode = useGeneralStore.getState().setClientMode;
      setClientMode(ClientMode.user);
      setCurrentUser(user);
      router.push(`benefits/${user._id}`);
    },
    onError: (error) => {
      errorAlert("הוספת משתמש נכשלה.");
    },
  });
};

// Update user by ID
export const useUpdateUserById = () => {
  return useMutation<User, Error, { id: string; updatedData: Partial<User> }>({
    mutationFn: ({ id, updatedData }) => updateUserById(id, updatedData),
    onMutate: async ({ id, updatedData }) => {
      inProccesAlert("מעדכן...")
      const oldUser= currentUser
      const newUser = { _id: id, ...updatedData } as User;
      setCurrentUser(newUser);  
      return oldUser   
    },
    onSuccess:()=>{
      successAlert("המידע עודכן בהצלחה!");
    },
    onError: (error, variables, context:any) => {
      console.error("Mutation error:", error);
      if (context) {
        setCurrentUser(context); 
      }
      //errorAlert("נכשל");
    },
  });
};

export const useDeleteUserById = () => {
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => deleteUserById(id),
    onSuccess: () => {
      const setClientMode = useGeneralStore.getState().setClientMode;
      setClientMode(ClientMode.general);
      setCurrentUser(null);
      successAlert("משתמש נמחק בהצלחה!")
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      errorAlert("מחיקת משתמש נכשלה");
    },
  });
};
