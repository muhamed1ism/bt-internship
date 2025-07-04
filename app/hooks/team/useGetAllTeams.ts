import { useQuery } from '@tanstack/react-query';
import { getAllTeamsApi } from '@app/api/team-api';

export const useGetAllTeams = () => {
  const {
    data: teams,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['get-all-teams'],
    queryFn: getAllTeamsApi,
  });

  return { teams, isLoading, isSuccess };
};
