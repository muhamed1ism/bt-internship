import { useQuery } from '@tanstack/react-query';
import { getTeamByIdApi } from '@app/api/team-api';
import { Team } from '@app/types/team';

export const useGetTeamById = (teamId: string) => {
  const {
    data: team,
    isLoading,
    isSuccess,
    error,
  } = useQuery<Team>({
    queryKey: ['get-team-by-id'],
    queryFn: () => getTeamByIdApi(teamId),
  });

  return { team, isLoading, isSuccess, error };
};
