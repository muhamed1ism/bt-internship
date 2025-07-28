import { useQuery } from '@tanstack/react-query';
import { getUserTeamsApi } from '@app/api/team-api';

export const useGetUserTeams = () => {
  const {
    data: userTeams,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['get-user-teams'],
    queryFn: getUserTeamsApi,
  });

  return { userTeams, isLoading, isSuccess };
};
