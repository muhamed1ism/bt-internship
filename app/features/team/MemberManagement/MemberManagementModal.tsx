import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@app/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@app/components/ui/avatar';
import { Users } from 'lucide-react';
import { MemberManagementProps, ViewMode } from '@app/types/member-management';
import { MemberManagementControls } from './MemberManagementControls';
import { MemberManagementCard } from './MemberManagementCard';
import { AddMemberCard } from './AddMemberCard';

export const MemberManagementModal = ({
  isOpen,
  onClose,
  teamName,
  members,
  onAddMember,
  onRemoveMember,
  onChangePosition,
}: Omit<MemberManagementProps, 'teamId'>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;

    const query = searchQuery.toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.position.title.toLowerCase().includes(query) ||
        member.skills.some((skill) => skill.toLowerCase().includes(query)) ||
        member.projects.some(
          (project) =>
            project.name.toLowerCase().includes(query) ||
            project.code.toLowerCase().includes(query),
        ),
    );
  }, [members, searchQuery]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-6xl flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          {/* Team Header */}
          <div className="mb-4 flex items-center justify-center">
            <div className="relative">
              <div className="flex items-center justify-center">
                {/* Left Avatar */}
                <Avatar className="relative z-10 h-12 w-12 border-2 border-white shadow-lg">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamName}-1`}
                  />
                  <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
                    T1
                  </AvatarFallback>
                </Avatar>

                {/* Center Avatar */}
                <Avatar className="relative z-20 -mx-3 h-16 w-16 border-2 border-white shadow-lg">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamName}-lead`}
                  />
                  <AvatarFallback className="bg-gray-800 text-lg font-semibold text-white">
                    {getInitials(teamName)}
                  </AvatarFallback>
                </Avatar>

                {/* Right Avatar */}
                <Avatar className="relative z-10 h-12 w-12 border-2 border-white shadow-lg">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamName}-3`}
                  />
                  <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
                    T3
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Team Icon Overlay */}
              <div className="bg-primary border-background absolute -right-1 -bottom-1 rounded-full border-2 p-1.5 shadow-sm">
                <Users className="text-primary-foreground h-3 w-3" />
              </div>
            </div>
          </div>

          <DialogTitle className="text-center text-3xl font-bold">{teamName}</DialogTitle>
          <p className="text-muted-foreground text-center">Manage members</p>
        </DialogHeader>

        {/* Controls */}
        <div className="flex-shrink-0 px-1">
          <MemberManagementControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddMember={onAddMember}
            memberCount={filteredMembers.length}
          />
        </div>

        {/* Members Grid/List */}
        <div className="flex-1 overflow-y-auto px-1">
          <div
            className={`py-4 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                : 'flex flex-col gap-4'
            }`}
          >
            {/* Add Member Card */}
            <AddMemberCard onAddMember={onAddMember} viewMode={viewMode} />

            {/* Member Cards */}
            {filteredMembers.map((member) => (
              <MemberManagementCard
                key={member.id}
                member={member}
                onRemove={onRemoveMember}
                onChangePosition={onChangePosition}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredMembers.length === 0 && searchQuery.trim() && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="text-muted-foreground/50 mb-4 h-12 w-12" />
              <h3 className="text-foreground mb-2 text-lg font-medium">No members found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search criteria or add a new member.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
