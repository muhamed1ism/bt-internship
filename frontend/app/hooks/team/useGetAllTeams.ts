import { useQuery } from '@tanstack/react-query';
import { getAllTeamsApi } from '@app/api/team-api';
import { Team } from '@app/types/team';

export const useGetAllTeams = () => {
  const {
    data: teams,
    isLoading,
    isSuccess,
  } = useQuery<Team[]>({
    queryKey: ['get-all-teams'],
    queryFn: getAllTeamsApi,
  });

  return { teams, isLoading, isSuccess };
};
