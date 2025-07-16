import { useQuery } from '@tanstack/react-query';
import { getUserTeamsApi } from '@app/api/team-api';

export const useGetMyTeams = () => {
  const {
    data: reports,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['get-my-teams'],
    queryFn: getUserTeamsApi,
  });

  return { reports, isLoading, isSuccess };
};
