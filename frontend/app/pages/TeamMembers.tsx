import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { SidebarInset } from '@app/components/ui/sidebar';
import { useGetTeamById } from '@app/hooks/team';
import { TeamMember } from '@app/types/team';
import { Spinner } from '@app/components/ui/spinner';
import { useMemberManagementPage } from '@app/features/team/hooks';
import { MemberManagementControls } from '@app/features/team/components/control/MemberManagementControls';
import { AddMemberCard } from '@app/features/team/components/card/AddMemberCard';
import { MemberManagementCard } from '@app/features/team/components/card/MemberManagementCard';
import { PositionChangeModal } from '@app/features/team/components/modal/PositionChangeModal';

export const TeamMembers = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { team, isLoading } = useGetTeamById(teamId || '');
  const navigate = useNavigate();

  // In a real app, you'd fetch team data based on the ID from params
  // const teamDetails = MOCK_TEAM_DETAILS;

  const {
    filteredMembers,
    searchTerm,
    viewMode,
    setSearchTerm,
    setViewMode,
    selectedMember,
    handleRemoveMember,
    // Member position change modal
    handleChangePosition,
    isPositionChangeOpen,
    handlePositionChangeConfirm,
    closePositionChangeModal,
  } = useMemberManagementPage(team?.members ?? [], team?.id ?? '');

  const handleBackToTeam = () => {
    navigate(`/teams/${teamId}`);
  };

  const handleAddMember = () => {
    navigate(`/teams/${teamId}/members/add`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full bg-gray-100 p-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="large" />
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarInset className="h-full bg-gray-100">
      {/* Header */}
      <div className="border-border bg-card sticky top-16 z-10 w-full border-b">
        <div className="w-full px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToTeam}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Team
              </Button>
            </div>
          </div>

          {/* Team Header */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Team Avatars */}
              <div className="relative flex">
                {team?.members &&
                  team.members.slice(0, 3).map((member, index) => (
                    <div
                      key={member.id}
                      className="border-background flex h-12 w-12 items-center justify-center rounded-full border-2 bg-neutral-200 text-sm font-medium"
                      style={{ marginLeft: index > 0 ? '-8px' : '0', zIndex: 3 - index }}
                    >
                      {(member.user.firstName + ' ' + member.user.lastName)
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  ))}
                {team && team._count.members > 3 && (
                  <div
                    className="bg-muted border-background flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-medium"
                    style={{ marginLeft: '-8px', zIndex: 0 }}
                  >
                    +{team._count.members - 3}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-foreground text-2xl font-bold">{team?.name}</h1>
                <p className="text-muted-foreground">Manage members</p>
              </div>
            </div>

            {/* Add Member Button */}
            <Button
              size="lg"
              onClick={handleAddMember}
              className="border-yellow-600 bg-yellow-400 text-black hover:border-yellow-700 hover:bg-yellow-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 py-6 sm:px-6">
        {/* Controls */}
        <MemberManagementControls
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          memberCount={filteredMembers.length}
        />

        {/* Members Grid */}
        <div className="mt-6 w-full">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              <AddMemberCard onAddMember={handleAddMember} viewMode={viewMode} />
              {filteredMembers.map((member: TeamMember) => (
                <MemberManagementCard
                  key={member.id}
                  member={member}
                  viewMode={viewMode}
                  onRemove={() => handleRemoveMember(member.id)}
                  onChangePosition={() => handleChangePosition(member.id)}
                />
              ))}
            </div>
          ) : (
            <div className="w-full space-y-3">
              <AddMemberCard onAddMember={handleAddMember} viewMode={viewMode} />
              {filteredMembers.map((member: TeamMember) => (
                <MemberManagementCard
                  key={member.id}
                  member={member}
                  viewMode={viewMode}
                  onRemove={() => handleRemoveMember(member.id)}
                  onChangePosition={() => handleChangePosition(member.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && searchTerm && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No members found matching "{searchTerm}"</p>
          </div>
        )}

        {/* No Members State */}
        {team?._count.members === 0 && !searchTerm && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No members found in this team</p>
          </div>
        )}
      </div>

      {/* Position Change Modal */}
      <PositionChangeModal
        isOpen={isPositionChangeOpen}
        onClose={closePositionChangeModal}
        member={selectedMember}
        onConfirm={handlePositionChangeConfirm}
      />
    </SidebarInset>
  );
};
