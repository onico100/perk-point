"use client";
import { useQuery, useMutation} from '@tanstack/react-query';
import { User } from '../types/types';
import useUserStore from '../stores/usersStore';
import useGeneralStore from "@/stores/generalStore";
import { addUser, updateUserById, deleteUserById, getUserById, getUserByCredentials } from '@/services/usersServices';

// Fetch user by ID
export const useGetUserById = (id: string) => {
  const setUser = useUserStore((state) => state.setUser);

  return useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: async () => {
      const user = await getUserById(id);
      setUser(user); 
      return user;
    },
    enabled: !!id,
    staleTime: 10000,
  });
};

// Login user by credentials
export const useLoginUser = () => {
  const setUser = useUserStore((state) => state.setUser);
  return useMutation<User, Error, { email: string; password: string }>({
    mutationFn: ({ email, password }) => getUserByCredentials(email, password),
    onSuccess: (user) => {
      // General Zustand Updating
      const setCurrentUser = useGeneralStore.getState().setCurrentUser;
      setCurrentUser(user);
      setUser(user); 
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
  const setUser = useUserStore((state) => state.setUser);

  return useMutation<User, Error, { id: string; updatedData: Partial<User> }>({
    mutationFn: ({ id, updatedData }) => updateUserById(id, updatedData),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
    },
  });
};


export const useDeleteUserById = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => deleteUserById(id),
    onSuccess: () => {
      setUser(null);
    },
  });
};

