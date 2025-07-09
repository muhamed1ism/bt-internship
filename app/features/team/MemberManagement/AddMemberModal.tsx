import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { Search, Users, X, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllUsersApi } from '@app/api/user-api';
import { UserType } from '@app/types/types';
import { AddMembersFormValues } from '@app/schemas';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (formData: AddMembersFormValues) => void;
  existingMemberIds: string[];
  isLoading?: boolean;
}

const POSITIONS = [
  'Team Lead',
  'Tech Lead',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Project Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'QA Engineer',
  'Product Manager',
  'Scrum Master',
  'Business Analyst',
];

export const AddMemberModal = ({
  isOpen,
  onClose,
  onConfirm,
  existingMemberIds,
  isLoading = false,
}: AddMemberModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Array<{
    userId: string;
    position: string;
    user: UserType;
  }>>([]);

  // Get all users
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

  const users = usersResponse?.data || [];

  // Filter out users who are already team members
  const availableUsers = useMemo(() => {
    return users.filter(user => !existingMemberIds.includes(user.id));
  }, [users, existingMemberIds]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return availableUsers;

    const query = searchQuery.toLowerCase();
    return availableUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [availableUsers, searchQuery]);

  const handleUserSelect = (user: UserType) => {
    const isAlreadySelected = selectedMembers.some(member => member.userId === user.id);
    if (isAlreadySelected) return;

    setSelectedMembers(prev => [
      ...prev,
      {
        userId: user.id,
        position: 'Member',
        user,
      },
    ]);
  };

  const handleUserDeselect = (userId: string) => {
    setSelectedMembers(prev => prev.filter(member => member.userId !== userId));
  };

  const handlePositionChange = (userId: string, position: string) => {
    setSelectedMembers(prev =>
      prev.map(member =>
        member.userId === userId ? { ...member, position } : member,
      ),
    );
  };

  const handleConfirm = () => {
    if (selectedMembers.length === 0) return;

    console.log('🔍 Adding members:', selectedMembers);

    const formData: AddMembersFormValues = {
      members: selectedMembers.map(member => ({
        userId: member.userId,
        position: member.position,
        teamId: '', // This will be filled by the API call
      })),
    };

    console.log('🔍 Form data being sent:', formData);
    onConfirm(formData);
    // Reset selected members to go back to list mode
    setSelectedMembers([]);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isSelectionMode = selectedMembers.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] w-[1400px] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isSelectionMode ? 'Assign Positions' : 'Add Team Members'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6 pb-6 min-h-0">
          {!isSelectionMode ? (
            // List Mode - Full width for browsing users
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <Label htmlFor="search">Search Users</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto border rounded-lg p-6 min-h-0">
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No users found matching your search' : 'No available users'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => {
                      const isSelected = selectedMembers.some(member => member.userId === user.id);
                      return (
                        <div
                          key={user.id}
                          className={`p-6 rounded-lg border cursor-pointer transition-colors w-full max-w-2xl ${
                            isSelected
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-muted/50 border-border'
                          }`}
                          onClick={() => handleUserSelect(user)}
                        >
                          <div className="flex items-center gap-6">
                            <Avatar className="h-16 w-16 flex-shrink-0">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}${user.lastName}`}
                              />
                              <AvatarFallback className="text-lg">
                                {getInitials(`${user.firstName} ${user.lastName}`)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-lg truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-base text-muted-foreground truncate mt-1">{user.email}</p>
                            </div>
                            {isSelected && (
                              <Badge variant="secondary" className="text-sm flex-shrink-0">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Selection Mode - Full width for role assignment
            <div className="flex flex-col h-full">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMembers([])}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Selection
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto border rounded-lg p-6 min-h-0">
                <div className="space-y-6">
                  {selectedMembers.map((member) => (
                    <div key={member.userId} className="p-6 border rounded-lg w-full max-w-2xl">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-6 min-w-0">
                          <Avatar className="h-16 w-16 flex-shrink-0">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user.firstName}${member.user.lastName}`}
                            />
                            <AvatarFallback className="text-lg">
                              {getInitials(`${member.user.firstName} ${member.user.lastName}`)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-lg truncate">
                              {member.user.firstName} {member.user.lastName}
                            </p>
                            <p className="text-base text-muted-foreground truncate mt-1">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUserDeselect(member.userId)}
                          className="h-6 w-6 p-0 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div>
                        <Label htmlFor={`position-${member.userId}`} className="text-base font-medium">
                          Position
                        </Label>
                        <Select
                          value={member.position}
                          onValueChange={(value) => handlePositionChange(member.userId, value)}
                        >
                          <SelectTrigger className="mt-3 w-80">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {POSITIONS.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {isSelectionMode && (
            <Button
              onClick={handleConfirm}
              disabled={selectedMembers.length === 0 || isLoading}
            >
              {isLoading ? 'Adding Members...' : `Add ${selectedMembers.length} Member${selectedMembers.length !== 1 ? 's' : ''}`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 