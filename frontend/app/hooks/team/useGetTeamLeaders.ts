import { useQuery } from '@tanstack/react-query';
import { getTeamLeadersApi } from '@app/api/team-api';
import { TeamMember } from '@app/types/team';

export const useGetTeamLeaders = (teamId: string) => {
  const {
    data: teamLeaders,
    isLoading,
    isSuccess,
  } = useQuery<TeamMember[]>({
    queryKey: ['get-team-leaders'],
    queryFn: () => getTeamLeadersApi(teamId),
  });

  return { teamLeaders, isLoading, isSuccess };
};
