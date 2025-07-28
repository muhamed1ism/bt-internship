import { useState, useMemo } from 'react';
import type { ViewMode } from '@app/types/member-management';
import { useAddMembers } from '@app/hooks/team';
import { AddMemberFormValues } from '@app/schemas';
import { User } from '@app/types/types';
import { useNavigate } from 'react-router-dom';

export const useAddMembersPage = (availableUsers: User[] | [], teamId: string) => {
  const {
    mutate: addMembers,
    isPending: isAddingMembers,
    error: errorAddingMembers,
  } = useAddMembers(teamId);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Selected new team members
  const [selectedMembers, setSelectedMembers] = useState<AddMemberFormValues[] | []>([]);

  const filteredUsers = useMemo(() => {
    if (!availableUsers) return [];

    const selectedUserIds = new Set(selectedMembers.map((member) => member.userId));

    const unselectedUsers = availableUsers.filter((user) => !selectedUserIds.has(user.id));

    if (!searchTerm.trim()) return unselectedUsers;

    const searchLower = searchTerm.toLowerCase();

    return unselectedUsers.filter((user) => {
      const matchesFirstName = user.firstName.toLowerCase().includes(searchLower);
      const matchesLastName = user.lastName.toLowerCase().includes(searchLower);
      const matchesEmail = user.email.toLowerCase().includes(searchLower);

      return matchesFirstName || matchesLastName || matchesEmail;
    });
  }, [availableUsers, selectedMembers, searchTerm]);

  const handleSelectMember = ({ userId, position }: AddMemberFormValues) => {
    setSelectedMembers((prev) => [...prev, { userId, position }]);
  };

  const handleDeselectMember = (userId: string) => {
    setSelectedMembers((prev) => prev.filter((member) => member.userId !== userId));
  };

  const handleChangePosition = (userId: string, position: string) => {
    setSelectedMembers((prev) =>
      prev.map((member) => (member.userId === userId ? { ...member, position: position } : member)),
    );
  };

  const handleAddMembers = () => {
    if (selectedMembers.length === 0) {
      navigate(`/teams/${teamId}/members`);
      return;
    }

    // Check if any member doesn't have a position assigned
    const membersWithoutPosition = selectedMembers.filter((member) => !member.position.trim());

    if (membersWithoutPosition.length > 0) {
      // Show alert - we'll handle this in the component
      return { hasError: true, membersWithoutPosition };
    }

    addMembers({ members: selectedMembers });
  };

  return {
    filteredUsers,
    selectedMembers,
    searchTerm,
    viewMode,
    setSearchTerm,
    setViewMode,
    // handleRemoveMember,
    // isRemovingMember,
    // handleChangePosition,
    // isChangingPosition,
    // Position change modal
    // isPositionChangeOpen,
    // selectedMember,
    // handlePositionChangeConfirm,
    // closePositionChangeModal,
    // Add member modal
    handleSelectMember,
    handleDeselectMember,
    handleChangePosition,
    handleAddMembers,
    isAddingMembers,
    errorAddingMembers,
  };
};
