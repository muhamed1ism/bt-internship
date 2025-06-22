import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { SidebarInset } from '@app/components/ui/sidebar';
import { MOCK_TEAM_DETAILS } from '@app/constants/team-members';
import type { TeamMemberCard } from '@app/types/member-management';
import {
  MemberManagementControls,
  MemberManagementCard,
  AddMemberCard,
  PositionChangeModal,
  useMemberManagementPage,
} from '@app/features/team';

export const TeamMembers = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  // In a real app, you'd fetch team data based on the ID from params
  const teamDetails = MOCK_TEAM_DETAILS;
  const teamName = `Team ${teamDetails.teamNumber}`;

  const {
    filteredMembers,
    searchTerm,
    viewMode,
    setSearchTerm,
    setViewMode,
    handleAddMember,
    handleRemoveMember,
    handleChangePosition,
    isPositionChangeOpen,
    selectedMember,
    handlePositionChangeConfirm,
    closePositionChangeModal,
  } = useMemberManagementPage();

  const handleBackToTeam = () => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <SidebarInset className="bg-background">
      {/* Header */}
      <div className="border-border bg-card sticky top-14 z-10 w-full border-b">
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
          <div className="mt-4 flex items-center gap-4">
            {/* Team Avatars */}
            <div className="relative flex">
              {teamDetails.members.slice(0, 3).map((member, index) => (
                <div
                  key={member.id}
                  className="bg-muted border-background flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-medium"
                  style={{ marginLeft: index > 0 ? '-8px' : '0', zIndex: 3 - index }}
                >
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
              ))}
              {teamDetails.members.length > 3 && (
                <div
                  className="bg-muted border-background flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-medium"
                  style={{ marginLeft: '-8px', zIndex: 0 }}
                >
                  +{teamDetails.members.length - 3}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-foreground text-2xl font-bold">{teamName}</h1>
              <p className="text-muted-foreground">Manage members</p>
            </div>
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
          onAddMember={handleAddMember}
        />

        {/* Members Grid */}
        <div className="mt-6 w-full">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              <AddMemberCard onAddMember={handleAddMember} viewMode={viewMode} />
              {filteredMembers.map((member: TeamMemberCard) => (
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
              <div className="border-border rounded-lg border p-4">
                <AddMemberCard onAddMember={handleAddMember} viewMode={viewMode} />
              </div>
              {filteredMembers.map((member: TeamMemberCard) => (
                <div key={member.id} className="border-border rounded-lg border p-4">
                  <MemberManagementCard
                    member={member}
                    viewMode={viewMode}
                    onRemove={() => handleRemoveMember(member.id)}
                    onChangePosition={() => handleChangePosition(member.id)}
                  />
                </div>
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
