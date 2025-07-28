import { getAllTeammatesApi } from '@app/api/user-api';
import { User } from '@app/types/types';
import { useQuery } from '@tanstack/react-query';

export const useGetTeammates = () => {
  const {
    data: teammates,
    isLoading,
    error,
  } = useQuery<User[] | null>({
    queryKey: ['get-all-teammates'],
    queryFn: getAllTeammatesApi,
  });

  return { teammates, isLoading, error };
};
