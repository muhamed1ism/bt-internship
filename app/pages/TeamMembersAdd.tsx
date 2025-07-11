import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { AvailableUserCard } from '@app/features/team/components/card/AvailableUserCard';
import { SelectedMemberCard } from '@app/features/team/components/card/SelectedMemberCard';
import { useAddMembersPage } from '@app/features/team/hooks/useAddMembersPage';
import { useGetTeamById } from '@app/hooks/team';
import { useGetAvailableUsers } from '@app/hooks/team/useGetAvailableUsers';
import { AddMemberFormValues } from '@app/schemas';
import { UserType } from '@app/types/types';
import { ArrowLeft, Check, LayoutGrid, List, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const TeamMembersAdd = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { team } = useGetTeamById(teamId || '');
  const { availableUsers, isLoading } = useGetAvailableUsers(teamId || '');
  const navigate = useNavigate();

  const handleBackToTeam = () => {
    navigate(`/teams/${teamId}/members`);
  };

  const {
    filteredUsers,
    handleAddMembers,
    handleChangePosition,
    handleDeselectMember,
    handleSelectMember,
    isAddingMembers,
    searchTerm,
    selectedMembers,
    setSearchTerm,
    setViewMode,
    viewMode,
    errorAddingMembers,
  } = useAddMembersPage(availableUsers ?? [], teamId ?? '');

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
                      className="border-background flex h-12 w-12 items-center justify-center rounded-full border-2 bg-gray-200 text-sm font-medium"
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
                onClick={handleAddMembers}
                className="border-yellow-600 bg-yellow-400 text-black hover:border-yellow-700 hover:bg-yellow-500"
              >
                <Check className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

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
                className="bg-primary-foreground h-[36px] pl-10"
              />
            </div>

            {/* View Mode Toggle and Member Count */}
            <div className="flex rounded-lg border-1">
              <Button
                size="icon"
                onClick={() => setViewMode('list')}
                className={`rounded-r-none ${viewMode === 'list' ? 'text-primary-foreground bg-primary' : 'text-primary bg-primary-foreground hover:bg-primary/10'}`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`rounded-l-none ${viewMode === 'grid' ? 'text-primary-foreground bg-primary' : 'text-primary bg-primary-foreground hover:bg-primary/10'}`}
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
                    changePosition={handleChangePosition}
                    deselectMember={handleDeselectMember}
                    viewMode={viewMode}
                    user={availableUsers?.find((user) => user.id === newMember.userId)}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full space-y-3">
                {selectedMembers.map((newMember: AddMemberFormValues) => (
                  <SelectedMemberCard
                    member={newMember}
                    changePosition={handleChangePosition}
                    deselectMember={handleDeselectMember}
                    viewMode={viewMode}
                    user={availableUsers?.find((user) => user.id === newMember.userId)}
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
