import { useQuery } from '@tanstack/react-query';
import { getAllTeamsApi } from '@app/api/team-api';
import { getAllUsersApi } from '@app/api/user-api';
import { BackendTeam, TransformedTeam } from '@app/types/team';
import { UserType } from '@app/types/types';
import { transformTeamsDataWithUsers } from '@app/utils/team';

export const useGetAllTeams = () => {
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

  // Handle null response from API
  const users = usersResponse || [];



  // Transform backend data to frontend format with user information
  // If users are available, use them; otherwise fall back to basic transformation
  const teams: TransformedTeam[] | undefined = backendTeams 
    ? (users.length > 0 
        ? transformTeamsDataWithUsers(backendTeams, users)
        : backendTeams.map(team => ({
            id: parseInt((team.id || '').replace(/-/g, '').substring(0, 8), 16) || 1,
            teamNumber: parseInt(team.name?.match(/\d+/)?.[0] || '1'),
            teamLead: { firstName: 'Unknown', lastName: 'Lead' },
            memberCount: team.members?.length || 0,
            name: team.name || 'Unnamed Team',
            status: team.status || 'IN_PROGRESS',
            clientName: team.clientName || 'Unknown Client',
            technologies: team.technologies?.map(tech => tech?.name).filter(Boolean) || []
          }))
      )
    : undefined;

  return { 
    teams, 
    isLoading: teamsLoading || usersLoading, 
    isSuccess: teamsSuccess && usersSuccess, 
    error: teamsError || usersError,
    backendTeams // Keep original data for forms that need it
  };
};
