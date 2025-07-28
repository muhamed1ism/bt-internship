import { getUserByIdApi } from '@app/api/user-api';
import { User } from '@app/types/types';
import { useQuery } from '@tanstack/react-query';

export const useGetUserById = (userId: string) => {
  const {
    data: user,
    isLoading,
    isSuccess,
    error,
  } = useQuery<User>({
    queryKey: ['get-user-by-id'],
    queryFn: () => getUserByIdApi(userId),
  });

  return { user, isLoading, isSuccess, error };
};
