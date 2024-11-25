import { useQuery } from '@tanstack/react-query';
import useSupplierStore from '../stores/suppliersStore';
import { Supplier } from '../types/types';
import { useQueryClient } from 'react-query';
import {getAll, add, deleteS, update} from "@/app/api/supliers"

export const useFetchSuppliers = () => {
  const setSuppliers = useSupplierStore((state:any) => state.setSuppliers);

  const queryClient = useQueryClient()

  const {data: suppliers, isLoading, isFetching} = useQuery({
    queryKey: ["suppliers"],
    queryFn: getAll,
    staleTime: 10000,
  });

  if(suppliers)
    setSuppliers(suppliers)

  return{
    suppliers,
    isLoading,
    isFetching
  }
}

