import { currentUserApi } from '@app/api/auth-api';
import { useQuery } from '@tanstack/react-query';

export const useCheckAuth = () => {
  const {
    data: user,
    isLoading,
    isSuccess: isAuthenticated,
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: currentUserApi,
    retry: false,
  });

  return { user, isLoading, isAuthenticated };
};
