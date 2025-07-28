import { useQuery } from '@tanstack/react-query';
import { User } from '@app/types/types';
import { getAllAdminsApi } from '@app/api/user-api';

export const useGetAllAdmins = () => {
  const {
    data: admins,
    isLoading,
    error,
  } = useQuery<User[] | null>({
    queryKey: ['get-all-admins'],
    queryFn: getAllAdminsApi,
  });

  return { admins, isLoading, error };
};
