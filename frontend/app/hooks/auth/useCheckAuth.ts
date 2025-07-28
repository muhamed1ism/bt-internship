import { useGetCurrentUserApi } from '@app/api/user-api';
import { useQuery } from '@tanstack/react-query';

export const useGetCurrentUser = () => {
  const {
    data: user,
    isLoading,
    isSuccess: isAuthenticated,
    error,
  } = useQuery({
    queryKey: ['get-current-user'],
    queryFn: useGetCurrentUserApi,
    retry: false,
  });

  return { user, isLoading, isAuthenticated, error };
};
