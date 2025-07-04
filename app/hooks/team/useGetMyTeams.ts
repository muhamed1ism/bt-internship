import { useQuery } from '@tanstack/react-query';
import { getMyTeamsApi } from '@app/api/team-api';

export const useGetMyTeams = () => {
  const {
    data: reports,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['get-my-teams'],
    queryFn: getMyTeamsApi,
  });

  return { reports, isLoading, isSuccess };
};
