import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { SidebarInset } from '@app/components/ui/sidebar';
import { Spinner } from '@app/components/ui/spinner';
import type { TeamMemberCard } from '@app/types/member-management';
import {
  MemberManagementControls,
  MemberManagementCard,
  AddMemberCard,
  PositionChangeModal,
  useMemberManagementPage,
} from '@app/features/team';
import { AddMemberModal } from '@app/features/team/MemberManagement/AddMemberModal';

export const TeamMembers = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const {
    filteredMembers,
    searchTerm,
    viewMode,
    isLoading,
    teamName,
    setSearchTerm,
    setViewMode,
    handleAddMember,
    handleRemoveMember,
    handleChangePosition,
    isPositionChangeOpen,
    selectedMember,
    handlePositionChangeConfirm,
    closePositionChangeModal,
    // Add member modal
    isAddMemberOpen,
    handleAddMemberConfirm,
    closeAddMemberModal,
    existingMemberIds,
    isAddingMembers,
  } = useMemberManagementPage();

  const handleBackToTeam = () => {
    navigate(`/teams/${teamId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
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
    <div className="min-h-screen bg-gray-100 p-6 pt-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-border bg-card sticky top-16 z-10 w-full border-b rounded-lg mb-6">
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
                {filteredMembers.slice(0, 3).map((member, index) => (
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
                {filteredMembers.length > 3 && (
                  <div
                    className="bg-muted border-background flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-medium"
                    style={{ marginLeft: '-8px', zIndex: 0 }}
                  >
                    +{filteredMembers.length - 3}
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
        <div className="w-full">
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

        {/* No Members State */}
        {filteredMembers.length === 0 && !searchTerm && (
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
      
      {/* Debug info */}
      <div style={{ display: 'none' }}>
        Debug: isPositionChangeOpen={isPositionChangeOpen.toString()}, 
        selectedMember={selectedMember ? selectedMember.name : 'null'}
      </div>

        {/* Add Member Modal */}
        <AddMemberModal
          isOpen={isAddMemberOpen}
          onClose={closeAddMemberModal}
          onConfirm={handleAddMemberConfirm}
          existingMemberIds={existingMemberIds}
          isLoading={isAddingMembers}
        />
      </div>
    </div>
  );
};
