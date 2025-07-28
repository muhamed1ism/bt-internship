import { useQuery } from '@tanstack/react-query';
import { getAllTeamsWithLeadersApi } from '@app/api/team-api';
import { Team } from '@app/types/team';

export const useGetAllTeamsWithLeaders = () => {
  const {
    data: teams,
    isLoading,
    isSuccess,
  } = useQuery<Team[]>({
    queryKey: ['get-all-teams-with-leaders'],
    queryFn: getAllTeamsWithLeadersApi,
  });

  return { teams, isLoading, isSuccess };
};
