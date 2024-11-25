import { useQuery } from '@tanstack/react-query';
import useSupplierStore from '../stores/suppliersStore';
import { Supplier } from '../types/types';
import { useMutation, useQueryClient } from 'react-query';
import {getAllSuppliers, addSupplier, deleteSupplier, updateSupplier} from "../services/supplier"

export const useFetchSuppliers = () => {
  const setSuppliers = useSupplierStore((state:any) => state.setSuppliers);

  const queryClient = useQueryClient()

  const {data: suppliers, isLoading, isFetching} = useQuery({
    queryKey: ["suppliers"],
    queryFn: getAllSuppliers,
    staleTime: 10000,
    
  },);

  if (suppliers) {
    setSuppliers(suppliers);
  }


  const addSuplierMutation=useMutation({
    mutationFn: addSupplier,
    onMutate: async (suplier: Omit<Supplier, '_id'>) => {
      await queryClient.cancelQueries({ queryKey: ['suppliers'] });
      const previousSuppliers = queryClient.getQueryData<Supplier[]>(['suppliers']);
      queryClient.setQueryData(['suppliers'], (old:any) => [...(old || []), {...suplier, _id: 'temp-id' }]);
      return { previousSuppliers };
    },
    onError: (error, _, context: any) => { queryClient.setQueryData(['suppliers'], context.previousSuppliers);},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  })

  const updateSupplierMutation=useMutation({
    mutationFn: updateSupplier,
    onMutate: async (updatedSupplier: Supplier) => {
      await queryClient.cancelQueries({ queryKey: ['suppliers'] });
      const previousSuppliers = queryClient.getQueryData<Supplier[]>(['suppliers']);
      const updatedSuppliers = previousSuppliers?.map(supplier => supplier._id === updatedSupplier._id? updatedSupplier : supplier);
      queryClient.setQueryData(['suppliers'], updatedSuppliers);
      return { previousSuppliers };
    },
    onError: (error, _, context: any) => { queryClient.setQueryData(['suppliers'], context.previousSuppliers);},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  })


  return{
    suppliers,
    isLoading,
    isFetching,
    addSupplier: addSuplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    // deleteUser: deleteSupplierrMutation.mutate,
  }
}

