import { useQuery } from 'react-query';
import axios from 'axios';
import { User } from '../types/types';
import useUserStore from '../stores/usersStore';


export const useFetchUsers = () => {
  const setUsers = useUserStore((state) => state.setUsers);

  return useQuery<User[]>(
    'users',
    async () => {
      const { data } = await axios.get('/api/users');
      return data;
    },
    {
      onSuccess: (data) => {setUsers(data);},
    }
  );
};
