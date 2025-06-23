import { useState } from 'react';
import { TeamMemberCard } from '@app/types/member-management';
import { MOCK_TEAM_MEMBER_CARDS } from '@app/__mocks__/team-members';

interface MemberManagementState {
  isOpen: boolean;
  members: TeamMemberCard[];
}

export function useMemberManagement() {
  const [state, setState] = useState<MemberManagementState>({
    isOpen: false,
    members: MOCK_TEAM_MEMBER_CARDS,
  });

  const openMemberManagement = () => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
    }));
  };

  const closeMemberManagement = () => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleAddMember = () => {
    console.log('Add member clicked');
    // TODO: Implement add member functionality
    // This could open another modal or form
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Remove member:', memberId);
    setState((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member.id !== memberId),
    }));
  };

  const handleChangePosition = (memberId: string) => {
    console.log('Change position for member:', memberId);
    // TODO: Implement position change functionality
    // This could open a position selection modal
  };

  return {
    isOpen: state.isOpen,
    members: state.members,
    openMemberManagement,
    closeMemberManagement,
    handleAddMember,
    handleRemoveMember,
    handleChangePosition,
  };
}
