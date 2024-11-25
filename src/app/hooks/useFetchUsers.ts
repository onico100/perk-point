import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types/types';
import useUserStore from '../stores/usersStore';
import { getUsers, addUser, updateUser, deleteUser } from '@/services/users';

export const useFetchUsers = () => {
  const queryClient = useQueryClient();
  const setUsers = useUserStore((state) => state.setUsers);


  const { data: users, isLoading, isFetching } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 10000,
    onSuccess: (data) => setUsers(data),
  });


  const addUserMutation = useMutation({
    mutationFn: addUser,
    onMutate: async (user: Omit<User, '_id'>) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData<User[]>(['users']);
      queryClient.setQueryData(['users'], (old) => [...(old || []), { ...user, _id: 'temp-id' }]);
      return { previousUsers };
    },
    onError: (error, _, context: any) => { queryClient.setQueryData(['users'], context.previousUsers);},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });


  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: string; user: Partial<User> }) => updateUser(id, user),
    onMutate: async ({ id, user }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData<User[]>(['users']);
      queryClient.setQueryData(['users'], (old) =>old?.map((existingUser) => (existingUser._id === id ? { ...existingUser, ...user } : existingUser)));
      return { previousUsers };
    },
    onError: (error, _, context: any) => { queryClient.setQueryData(['users'], context.previousUsers);},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });


  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData<User[]>(['users']);
      queryClient.setQueryData(['users'], (old) => old?.filter((user) => user._id !== id));
      return { previousUsers };
    },
    onError: (error, _, context: any) => {queryClient.setQueryData(['users'], context.previousUsers);},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  return {
    users,
    isLoading,
    isFetching,
    addUser: addUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
  };
};
