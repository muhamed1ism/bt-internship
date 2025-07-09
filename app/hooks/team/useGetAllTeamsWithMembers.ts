import { useQuery } from '@tanstack/react-query';
import { getAllTeamsApi, getTeamMembersApi } from '@app/api/team-api';
import { getAllUsersApi } from '@app/api/user-api';
import { BackendTeam, TransformedTeam } from '@app/types/team';
import { UserType } from '@app/types/types';
import { transformTeamsDataWithUsers } from '@app/utils/team';

export const useGetAllTeamsWithMembers = () => {
  const {
    data: backendTeams,
    isLoading: teamsLoading,
    isSuccess: teamsSuccess,
    error: teamsError,
  } = useQuery<BackendTeam[]>({
    queryKey: ['get-all-teams'],
    queryFn: getAllTeamsApi,
    retry: 1,
  });

  const {
    data: usersResponse,
    isLoading: usersLoading,
    isSuccess: usersSuccess,
    error: usersError,
  } = useQuery<UserType[] | null>({
    queryKey: ['get-all-users'],
    queryFn: getAllUsersApi,
    retry: 1,
  });

  // Fetch members for each team in parallel
  const teamMembersQueries = backendTeams?.map(team => 
    useQuery({
      queryKey: ['get-team-members', team.id],
      queryFn: () => getTeamMembersApi(team.id),
      retry: 1,
      enabled: !!team.id,
    })
  ) || [];

  // Handle null response from API
  const users = usersResponse || [];



  // Check if all queries are loading
  const membersLoading = teamMembersQueries.some(query => query.isLoading);
  const membersError = teamMembersQueries.find(query => query.error)?.error;

  // Combine teams with their members
  const teamsWithMembers = backendTeams?.map((team, index) => {
    const membersQuery = teamMembersQueries[index];
    const members = membersQuery?.data || [];
    
    return {
      ...team,
      members
    };
  });

  // Transform backend data to frontend format with user information
  const teams: TransformedTeam[] | undefined = teamsWithMembers && users.length > 0 
    ? transformTeamsDataWithUsers(teamsWithMembers, users)
    : undefined;

  return { 
    teams, 
    isLoading: teamsLoading || usersLoading || membersLoading, 
    isSuccess: teamsSuccess && usersSuccess && teamMembersQueries.every(q => q.isSuccess), 
    error: teamsError || usersError || membersError,
    backendTeams // Keep original data for forms that need it
  };
}; 