import { useState, useMemo } from 'react';
import { MOCK_TEAM_MEMBER_CARDS } from '@app/__mocks__/team-members';
import type { TeamMemberCard, ViewMode, MemberPosition } from '@app/types/member-management';

export const useMemberManagementPage = () => {
  const [members, setMembers] = useState<TeamMemberCard[]>(MOCK_TEAM_MEMBER_CARDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Position change modal state
  const [isPositionChangeOpen, setIsPositionChangeOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberCard | null>(null);

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;

    const searchLower = searchTerm.toLowerCase();
    return members.filter((member) => {
      const matchesName = member.name.toLowerCase().includes(searchLower);
      const matchesEmail = member.email.toLowerCase().includes(searchLower);
      const matchesPosition = member.position.title.toLowerCase().includes(searchLower);
      const matchesSkills = member.skills.some((skill) =>
        skill.toLowerCase().includes(searchLower),
      );
      const matchesProjects = member.projects.some(
        (project) =>
          project.name.toLowerCase().includes(searchLower) ||
          project.code.toLowerCase().includes(searchLower),
      );

      return matchesName || matchesEmail || matchesPosition || matchesSkills || matchesProjects;
    });
  }, [members, searchTerm]);

  const handleAddMember = () => {
    console.log('Add member clicked');
    // TODO: Open add member modal or navigate to add member page
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Remove member:', memberId);
    // TODO: Implement member removal
    setMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId));
  };

  const handleChangePosition = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsPositionChangeOpen(true);
    }
  };

  const handlePositionChangeConfirm = async (memberId: string, newPosition: MemberPosition) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, position: newPosition } : member,
      ),
    );

    console.log('Position changed for member:', memberId, 'to:', newPosition.title);
  };

  const closePositionChangeModal = () => {
    setIsPositionChangeOpen(false);
    setSelectedMember(null);
  };

  return {
    members,
    filteredMembers,
    searchTerm,
    viewMode,
    setSearchTerm,
    setViewMode,
    handleAddMember,
    handleRemoveMember,
    handleChangePosition,
    // Position change modal
    isPositionChangeOpen,
    selectedMember,
    handlePositionChangeConfirm,
    closePositionChangeModal,
  };
};
