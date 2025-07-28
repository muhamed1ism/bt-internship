import { useQuery } from '@tanstack/react-query';
import { getTeamMembersApi } from '@app/api/team-api';
import { TeamMember } from '@app/types/team';

export const useGetTeamMembers = (teamId: string) => {
  const {
    data: teamMembers,
    isLoading,
    isSuccess,
  } = useQuery<TeamMember[]>({
    queryKey: ['get-team-members'],
    queryFn: () => getTeamMembersApi(teamId),
  });

  return { teamMembers, isLoading, isSuccess };
};
