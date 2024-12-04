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

//import useUserStore from '../stores/usersStore';
//const setUser = useUserStore((state) => state.setUser);
const setCurrentUser = useGeneralStore.getState().setCurrentUser;
// Fetch user by ID
export const useGetUserById = (id: string) => {
  return useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: async () => {
      const user = await getUserById(id);
      //setUser(user);
      setCurrentUser(user);
      return user;
    },
    enabled: !!id,
    staleTime: 10000,
  });
};

// Login user by credentials
export const useLoginUser = () => {
  const router = useRouter();
  return useMutation<User, Error, { email: string; password: string }>({
    mutationFn: ({ email, password }) => getUserByCredentials(email, password),
    onSuccess: (user) => {
      console.log("User login successful:", user);
      const setClientMode = useGeneralStore.getState().setClientMode;
      setClientMode(ClientMode.user);
      setCurrentUser(user);

      router.push(`benefits/${user._id}`);
      console.log(22, `Welcome, ${user.username}!)!`);
    },
  });
};

// Add new user
export const useAddUser = () => {
  return useMutation<User, Error, User>({
    mutationFn: addUser,
  });
};

// Update user by ID
export const useUpdateUserById = () => {
  return useMutation<User, Error, { id: string; updatedData: Partial<User> }>({
    mutationFn: ({ id, updatedData }) => updateUserById(id, updatedData),
    onMutate: async ({ id, updatedData }) => {
      const newUser = { _id: id, ...updatedData } as User;
      setCurrentUser(newUser);
    },
    onError: (error, variables, context) => {
      console.error("Mutation error:", error);
    },
  });
};

export const useDeleteUserById = () => {
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => deleteUserById(id),
    onSuccess: () => {
      //setCurrentUser(updatedUser);
      const setClientMode = useGeneralStore.getState().setClientMode;
      setClientMode(ClientMode.general);
      setCurrentUser(null);
      //setUser(null);
    },
  });
};
