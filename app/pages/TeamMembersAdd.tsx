import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Alert, AlertDescription } from '@app/components/ui/alert';
import { AvailableUserCard } from '@app/features/team/components/card/AvailableUserCard';
import { SelectedMemberCard } from '@app/features/team/components/card/SelectedMemberCard';
import { useAddMembersPage } from '@app/features/team/hooks/useAddMembersPage';
import { useGetTeamById } from '@app/hooks/team';
import { useGetAvailableUsers } from '@app/hooks/team/useGetAvailableUsers';
import { AddMemberFormValues } from '@app/schemas';
import { UserType } from '@app/types/types';
import { ArrowLeft, Check, LayoutGrid, List, Search, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

export const TeamMembersAdd = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { team } = useGetTeamById(teamId || '');
  const { availableUsers, isLoading } = useGetAvailableUsers(teamId || '');
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showValidationError, setShowValidationError] = useState(false);

  const handleBackToTeam = () => {
    navigate(`/teams/${teamId}/members`);
  };

  const {
    filteredUsers,
    handleAddMembers,
    handleChangePosition,
    handleDeselectMember,
    handleSelectMember,
    searchTerm,
    selectedMembers,
    setSearchTerm,
    setViewMode,
    viewMode,
    errorAddingMembers,
  } = useAddMembersPage(availableUsers ?? [], teamId ?? '');

  const handleSaveMembers = () => {
    // Check if any member doesn't have a position assigned
    const membersWithoutPosition = selectedMembers.filter(member => !member.position.trim());
    
    if (membersWithoutPosition.length > 0) {
      const memberNames = membersWithoutPosition.map(member => {
        const user = availableUsers?.find(user => user.id === member.userId);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
      }).join(', ');
      
      setValidationError(`Please assign positions to the following members: ${memberNames}`);
      setShowValidationError(true);
      return;
    }

    // Clear validation errors if validation passes
    setValidationError(null);
    setShowValidationError(false);

    // If validation passes, proceed with adding members
    handleAddMembers();
  };

  const handlePositionChange = (userId: string, position: string) => {
    handleChangePosition(userId, position);
    
    // Clear validation error if all members now have positions
    const updatedMembers = selectedMembers.map(member => 
      member.userId === userId ? { ...member, position } : member
    );
    const membersWithoutPosition = updatedMembers.filter(member => !member.position.trim());
    
    if (membersWithoutPosition.length === 0) {
      setValidationError(null);
      setShowValidationError(false);
    }
  };

  return (
    <div className="h-full bg-gray-100">
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
          <div className="mt-4 flex items-center justify-between gap-4">
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
                <p className="text-muted-foreground">Add members</p>
              </div>
            </div>

            <div>
              {errorAddingMembers && <p className="text-red-500">{errorAddingMembers.message}</p>}

              {/* Save Button */}
              <Button
                size="lg"
                onClick={handleSaveMembers}
                className="border-yellow-600 bg-yellow-400 text-black hover:border-yellow-700 hover:bg-yellow-500"
              >
                <Check className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Alert */}
      {showValidationError && validationError && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
          <Alert className="border-yellow-200 bg-yellow-50 shadow-lg animate-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {validationError}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="w-full px-4 py-6 sm:px-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search bar */}
            <div className="relative w-full flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card h-[36px] pl-10"
              />
            </div>

            {/* View Mode Toggle and Member Count */}
            <div className="flex rounded-lg border-1">
              <Button
                size="icon"
                onClick={() => setViewMode('list')}
                className={`rounded-r-none ${viewMode === 'list' ? 'text-secondary bg-primary' : 'text-primary bg-card hover:bg-primary/10'}`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`rounded-l-none ${viewMode === 'grid' ? 'text-secondary bg-primary' : 'text-primary bg-card hover:bg-primary/10'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Selected new members */}
        <div className="my-6">
          <h1 className="text-xl">Selected Users</h1>
          <p className="text-muted-foreground text-sm">{selectedMembers.length} new members</p>
        </div>

        <div className="h-92">
          {/* No Members State */}
          {selectedMembers.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-center text-2xl">No selected member</p>
            </div>
          )}

          {/* Grid / List of selected new members */}
          <div className="w-full">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {selectedMembers.map((newMember: AddMemberFormValues) => (
                  <SelectedMemberCard
                    member={newMember}
                    changePosition={handlePositionChange}
                    deselectMember={handleDeselectMember}
                    viewMode={viewMode}
                    user={availableUsers?.find((user) => user.id === newMember.userId)}
                    showValidationError={showValidationError}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full space-y-3">
                {selectedMembers.map((newMember: AddMemberFormValues) => (
                  <SelectedMemberCard
                    member={newMember}
                    changePosition={handlePositionChange}
                    deselectMember={handleDeselectMember}
                    viewMode={viewMode}
                    user={availableUsers?.find((user) => user.id === newMember.userId)}
                    showValidationError={showValidationError}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available Users */}
        <div className="border-primary/20 mx-2 my-6 border-t-1 pt-6">
          <h1 className="text-xl">Available Users</h1>
          <p className="text-muted-foreground text-sm">
            {availableUsers && selectedMembers
              ? availableUsers?.length - selectedMembers?.length
              : 0}{' '}
            users
          </p>
        </div>

        <div className="h-92">
          {/* Empty State */}
          {filteredUsers.length === 0 && searchTerm && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No available users found matching "{searchTerm}"
              </p>
            </div>
          )}

          {/* No Members State */}
          {(availableUsers?.length === 0 && !searchTerm) ||
            (availableUsers && availableUsers?.length - selectedMembers.length < 1 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No available users found</p>
              </div>
            ))}

          {/* Grid / List of available users */}
          <div className="w-full">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredUsers.map((user: UserType) => (
                  <AvailableUserCard
                    user={user}
                    selectMember={handleSelectMember}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full space-y-3">
                {filteredUsers.map((user: UserType) => (
                  <AvailableUserCard
                    user={user}
                    selectMember={handleSelectMember}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
