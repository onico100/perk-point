import { create } from 'zustand';
import { User } from '../types/types';

interface UserStore {
  users: User[]; 
  setUsers: (users: User[]) => void; 
}

const useUserStore = create<UserStore>((set) => ({
  users: [], 
  setUsers: (users: User[]) => set({ users }),
}));

export default useUserStore;
