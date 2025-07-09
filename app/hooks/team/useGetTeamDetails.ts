import { useQuery } from '@tanstack/react-query';
import { getAllTeamsApi, getTeamMembersApi } from '@app/api/team-api';
import { getAllUsersApi } from '@app/api/user-api';
import { BackendTeam, BackendTeamMember } from '@app/types/team';
import { TeamDetails, TeamMember, TeamProject } from '@app/types/team-member';
import { UserType } from '@app/types/types';
import { transformTeamData } from '@app/utils/team';

// Transform backend team member to frontend format
const transformTeamMember = (backendMember: BackendTeamMember, users: UserType[]): TeamMember => {
  // Find user information by userId
  const user = users.find(u => u.id === backendMember.userId) || {} as UserType;
  const firstName = user.firstName || 'Unknown';
  const lastName = user.lastName || 'User';
  const email = user.email || 'unknown@example.com';

  return {
    id: backendMember.id,
    name: `${firstName} ${lastName}`,
    email: email,
    position: {
      title: backendMember.position || 'Member',
      level: 'Mid', // Default level since backend doesn't provide it
      department: 'Engineering', // Default department
      isLead: (backendMember.position || '').toLowerCase().includes('lead'),
    },
    status: {
      type: 'active',
      label: 'Active',
      color: 'bg-blue-500',
    },
    skills: [], // Backend doesn't provide skills yet
    joinDate: backendMember.joinedAt ? backendMember.joinedAt.split('T')[0] : new Date().toISOString().split('T')[0],
    lastActivity: new Date().toISOString().split('T')[0], // Default to today
  };
};

// Transform backend team to TeamDetails format
const transformToTeamDetails = (
  backendTeam: BackendTeam,
  backendMembers: BackendTeamMember[],
  users: UserType[]
): TeamDetails => {
  const transformedTeam = transformTeamData(backendTeam);
  const members = backendMembers.map(member => transformTeamMember(member, users));
  
  // Find team lead - prioritize Team Lead, then Tech Lead, then first member
  const teamLead = members.find(member => 
    member.position.title.toLowerCase() === 'team lead'
  ) || members.find(member => 
    member.position.title.toLowerCase() === 'tech lead'
  ) || members[0];

  return {
    id: transformedTeam.id,
    teamNumber: transformedTeam.teamNumber,
    teamLead: teamLead || members[0],
    members,
    project: {
      id: backendTeam.id,
      name: backendTeam.name,
      status: backendTeam.status,
      startDate: backendTeam.startDate.split('T')[0],
      description: backendTeam.projectDescription,
      progress: 65, // Default progress since backend doesn't provide it
    },
    stats: {
      totalMembers: members.length,
      activeMembers: members.length,
      completedTasks: 0, // Default since backend doesn't provide task data
      inProgressTasks: 0,
    },
  };
};

export const useGetTeamDetails = (teamId: string) => {
  // Get all teams to find the specific team
  const {
    data: backendTeams,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = useQuery<BackendTeam[]>({
    queryKey: ['get-all-teams'],
    queryFn: getAllTeamsApi,
    retry: 1,
  });

  // Find the specific team and get its original backend ID
  const backendTeam = backendTeams?.find(team => {
    const teamNumericId = parseInt(team.id.replace(/-/g, '').substring(0, 8), 16);
    const numericTeamId = parseInt(teamId);
    return teamNumericId === numericTeamId;
  });

  // Get team members using the original backend team ID
  const {
    data: backendMembers,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useQuery<BackendTeamMember[]>({
    queryKey: ['get-team-members', backendTeam?.id],
    queryFn: () => getTeamMembersApi(backendTeam!.id),
    retry: 1,
    enabled: !!backendTeam?.id,
  });

  // Get all users to match with team members
  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery<{ data: UserType[] | null }>({
    queryKey: ['get-all-users'],
    queryFn: async () => {
      const result = await getAllUsersApi();
      return { data: result };
    },
    retry: 1,
  });

  // Extract users array, handling null case
  const users = usersResponse?.data || [];

  // Transform data
  const teamDetails: TeamDetails | undefined = (() => {
    if (!backendTeam || !backendMembers || !users.length) return undefined;
    return transformToTeamDetails(backendTeam, backendMembers, users);
  })();

  return {
    teamDetails,
    backendTeam,
    backendMembers,
    isLoading: isLoadingTeams || isLoadingMembers || isLoadingUsers,
    error: teamsError || membersError || usersError,
  };
}; 