import { useQuery } from '@tanstack/react-query';
import { getAvailableUsersApi } from '@app/api/team-api';
import { User } from '@app/types/types';

export const useGetAvailableUsers = (teamId: string) => {
  const {
    data: availableUsers,
    isLoading,
    isSuccess,
  } = useQuery<User[]>({
    queryKey: ['get-available-users'],
    queryFn: () => getAvailableUsersApi(teamId),
  });

  return { availableUsers, isLoading, isSuccess };
};
