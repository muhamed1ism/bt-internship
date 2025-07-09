import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsersApi } from '@app/api/user-api';
import { 
  getTeamMembersApi, 
  deleteMemberApi, 
  updateMemberPositionApi,
  addMembersApi
} from '@app/api/team-api';
import { getAllTeamsApi } from '@app/api/team-api';
import { BackendTeam, BackendTeamMember } from '@app/types/team';
import { UserType } from '@app/types/types';
import { UpdateMemberPositionFormValues, AddMembersFormValues } from '@app/schemas';
import type { TeamMemberCard, ViewMode, MemberPosition } from '@app/types/member-management';

// Transform backend team member to frontend format
const transformTeamMember = (backendMember: BackendTeamMember, users: UserType[]): TeamMemberCard => {
  // Find user information by userId
  const user = users.find(u => u.id === backendMember.userId) || {} as UserType;
  const firstName = user.firstName || 'Unknown';
  const lastName = user.lastName || 'User';
  const email = user.email || 'unknown@example.com';

  return {
    id: backendMember.id,
    name: `${firstName} ${lastName}`,
    email: email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
    position: {
      title: backendMember.position || 'Member',
      level: 'Mid', // Default level since backend doesn't provide it
      department: 'Engineering', // Default department
      isLead: (backendMember.position || '').toLowerCase().includes('lead'),
    },
    status: 'active',
    skills: [], // Backend doesn't provide skills yet
    projects: [], // Backend doesn't provide projects yet
    joinDate: backendMember.joinedAt ? backendMember.joinedAt.split('T')[0] : new Date().toISOString().split('T')[0],
  };
};

export const useMemberManagementPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Position change modal state
  const [isPositionChangeOpen, setIsPositionChangeOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberCard | null>(null);

  // Add member modal state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Get all teams to find the specific team
  const {
    data: backendTeams,
    isLoading: isLoadingTeams,
  } = useQuery<BackendTeam[]>({
    queryKey: ['get-all-teams'],
    queryFn: getAllTeamsApi,
    retry: 1,
  });

  // Find the specific team and get its original backend ID
  const backendTeam = backendTeams?.find(team => {
    const teamNumericId = parseInt(team.id.replace(/-/g, '').substring(0, 8), 16);
    const numericTeamId = parseInt(teamId!);
    return teamNumericId === numericTeamId;
  });

  // Get team members using the original backend team ID
  const {
    data: backendMembers,
    isLoading: isLoadingMembers,
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

  // Transform backend data to frontend format
  const members: TeamMemberCard[] = useMemo(() => {
    if (!backendMembers || !users.length) return [];
    return backendMembers.map(member => transformTeamMember(member, users));
  }, [backendMembers, users]);

  // Get existing member user IDs for filtering
  const existingMemberIds = useMemo(() => {
    return backendMembers?.map(member => member.userId) || [];
  }, [backendMembers]);

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: async ({ formData, teamId: teamIdParam }: { formData: AddMembersFormValues; teamId: string }) => {
      return addMembersApi(formData, teamIdParam);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-team-members', backendTeam?.id] });
      queryClient.invalidateQueries({ queryKey: ['get-all-teams'] });
      setIsAddMemberOpen(false);
    },
  });

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: ({ teamId: teamIdParam, userId }: { teamId: string; userId: string }) =>
      deleteMemberApi(teamIdParam, userId),
    onSuccess: () => {
      // Invalidate and refetch team members
      queryClient.invalidateQueries({ queryKey: ['get-team-members', backendTeam?.id] });
    },
  });

  // Update member position mutation
  const updatePositionMutation = useMutation({
    mutationFn: ({
      formData,
      teamId: teamIdParam,
      userId,
    }: {
      formData: UpdateMemberPositionFormValues;
      teamId: string;
      userId: string;
    }) => updateMemberPositionApi(formData, teamIdParam, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-team-members', backendTeam?.id] });
    },
  });

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;

    const searchLower = searchTerm.toLowerCase();
    return members.filter((member) => {
      const matchesName = member.name.toLowerCase().includes(searchLower);
      const matchesEmail = member.email.toLowerCase().includes(searchLower);
      const matchesPosition = member.position.title.toLowerCase().includes(searchLower);
      const matchesSkills = member.skills.some((skill) =>
        skill.toLowerCase().includes(searchLower),
      );
      const matchesProjects = member.projects.some(
        (project) =>
          project.name.toLowerCase().includes(searchLower) ||
          project.code.toLowerCase().includes(searchLower),
      );

      return matchesName || matchesEmail || matchesPosition || matchesSkills || matchesProjects;
    });
  }, [members, searchTerm]);

  const handleAddMember = () => {
    setIsAddMemberOpen(true);
  };

  const handleAddMemberConfirm = (formData: AddMembersFormValues) => {
    if (!backendTeam) return;
    
    addMemberMutation.mutate({
      formData,
      teamId: backendTeam.id,
    });
  };

  const handleRemoveMember = (memberId: string) => {
    if (!backendTeam) return;
    
    // Find the member to get the userId
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    // Find the backend member to get the userId
    const backendMember = backendMembers?.find(m => m.id === memberId);
    if (!backendMember) return;

    deleteMemberMutation.mutate({
      teamId: backendTeam.id,
      userId: backendMember.userId,
    });
  };

  const handleChangePosition = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsPositionChangeOpen(true);
    }
  };

  const handlePositionChangeConfirm = async (memberId: string, newPosition: MemberPosition) => {
    if (!backendTeam) return;

    // Find the backend member to get the userId
    const backendMember = backendMembers?.find(m => m.id === memberId);
    if (!backendMember) return;

    const formData: UpdateMemberPositionFormValues = {
      position: newPosition.title,
    };

    updatePositionMutation.mutate({
      formData,
      teamId: backendTeam.id,
      userId: backendMember.userId,
    });

    closePositionChangeModal();
  };

  const closePositionChangeModal = () => {
    setIsPositionChangeOpen(false);
    setSelectedMember(null);
  };

  const closeAddMemberModal = () => {
    setIsAddMemberOpen(false);
  };

  return {
    members,
    filteredMembers,
    searchTerm,
    viewMode,
    isLoading: isLoadingTeams || isLoadingMembers || isLoadingUsers,
    setSearchTerm,
    setViewMode,
    handleAddMember,
    handleRemoveMember,
    handleChangePosition,
    // Position change modal
    isPositionChangeOpen,
    selectedMember,
    handlePositionChangeConfirm,
    closePositionChangeModal,
    // Add member modal
    isAddMemberOpen,
    handleAddMemberConfirm,
    closeAddMemberModal,
    existingMemberIds,
    isAddingMembers: addMemberMutation.isPending,
    // Team info
    teamName: backendTeam?.name || `Team ${teamId}`,
  };
};
