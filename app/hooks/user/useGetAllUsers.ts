import { useQuery } from '@tanstack/react-query';
import { User } from '@app/types/types';
import { getAllUsersApi } from '@app/api/user-api';

export const useGetAllUsers = () => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[] | null>({
    queryKey: ['get-all-users'],
    queryFn: getAllUsersApi,
  });

  return { users, isLoading, error };
};
