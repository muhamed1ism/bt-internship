import { useParams, useNavigate } from 'react-router-dom';
import { TeamHeader, MembersGrid, TeamFormModal, useTeamForm, PositionChangeModal } from '@app/features/team';
import { useGetTeamDetails } from '@app/hooks/team';
import { Spinner } from '@app/components/ui/spinner';
import { useState } from 'react';
import type { TeamMember } from '@app/types/team-member';
import type { MemberPosition, TeamMemberCard } from '@app/types/member-management';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMemberPositionApi } from '@app/api/team-api';
import { UpdateMemberPositionFormValues } from '@app/schemas';

export const TeamView = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Position change modal state
  const [isPositionChangeOpen, setIsPositionChangeOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Get team details from backend
  const { teamDetails, backendTeam, backendMembers, isLoading, error } = useGetTeamDetails(teamId!);
  const { formState, openEditForm, closeForm, handleSave, handleRemove } = useTeamForm();

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
      // Invalidate specific queries for this team
      if (backendTeam) {
        queryClient.invalidateQueries({ queryKey: ['get-team-members', backendTeam.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['get-all-teams'] });
    },
  });

  const handleManageMembers = () => {
    navigate(`/teams/${teamId}/members`);
  };

  const handleEditTeam = () => {
    if (teamDetails) {
      // Convert team details to form format
      const formData = {
        name: teamDetails.project?.name || '',
        status: teamDetails.project?.status || 'IN_PROGRESS',
        technologies: [], // Will need to be populated from backend
        client: 'Unknown Client', // Will need to be populated from backend
        startDate: teamDetails.project?.startDate || new Date().toISOString().split('T')[0],
        projectDescription: teamDetails.project?.description || '',
        projectName: teamDetails.project?.name || '',
        githubUrls: [],
        jiraUrls: [],
        priority: 'medium' as const,
        endDate: undefined,
        budget: undefined
      };
      openEditForm(formData);
    }
  };

  const handleSubmitReport = (memberId: string) => {
    console.log('Submit report for member:', memberId);
    // TODO: Open submit report modal or navigate to report page
  };

  const openPositionChangeModal = (memberId: string) => {
    const member = teamDetails?.members.find((m) => m.id === memberId);
    
    if (member) {
      setSelectedMember(member);
      setIsPositionChangeOpen(true);
    }
  };

  const handlePositionChangeConfirm = async (memberId: string, newPosition: MemberPosition) => {
    if (!teamDetails || !backendTeam || !backendMembers) return;

    // Find the backend member to get the userId
    const backendMember = backendMembers.find(m => m.id === memberId);
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

  // Convert TeamMember to TeamMemberCard format for the modal
  const selectedMemberForModal: TeamMemberCard | null = selectedMember ? {
    id: selectedMember.id,
    name: selectedMember.name,
    email: selectedMember.email,
    avatar: selectedMember.avatar,
    position: selectedMember.position,
    status: selectedMember.status.type === 'active' ? 'active' : 'inactive',
    skills: selectedMember.skills,
    projects: [], // TeamMember doesn't have projects, so we'll use empty array
    joinDate: selectedMember.joinDate,
  } : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="large" />
              <p className="text-muted-foreground">Loading team details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <p className="text-destructive text-lg font-semibold">Failed to load team details</p>
              <p className="text-muted-foreground text-sm">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Team not found
  if (!teamDetails) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <p className="text-destructive text-lg font-semibold">Team Not Found</p>
              <p className="text-muted-foreground text-sm">The requested team could not be found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-16">
      <div className="mx-auto max-w-7xl">
        {/* Team Header */}
        <TeamHeader
          teamDetails={teamDetails}
          onManageMembers={handleManageMembers}
          onEdit={handleEditTeam}
        />

        {/* Members Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-foreground mb-2 text-2xl font-bold">Team Members</h2>
            <p className="text-muted-foreground">Manage and view details of all team members</p>
          </div>

          <MembersGrid
            members={teamDetails.members}
            onSubmitReport={handleSubmitReport}
            onChangePosition={openPositionChangeModal}
          />
        </div>

        {/* Team Form Modal */}
        <TeamFormModal
          isOpen={formState.isOpen}
          onClose={closeForm}
          onSave={handleSave}
          onRemove={handleRemove}
          mode={formState.mode}
          team={formState.team}
        />

        {/* Position Change Modal */}
        <PositionChangeModal
          isOpen={isPositionChangeOpen}
          onClose={closePositionChangeModal}
          member={selectedMemberForModal}
          onConfirm={handlePositionChangeConfirm}
        />
      </div>
    </div>
  );
};
