import { useQuery } from '@tanstack/react-query';
import { getTeamMembersApi } from '@app/api/team-api';

export const useGetTeamMembers = (teamId: string) => {
  const {
    data: reports,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['get-team-members'],
    queryFn: () => getTeamMembersApi(teamId),
  });

  return { reports, isLoading, isSuccess };
};
