import { useState, useMemo } from 'react';
import type { ViewMode } from '@app/types/member-management';
import { TeamMember } from '@app/types/team';
import { useAddMembers, useDeleteMember, useUpdateMemberPosition } from '@app/hooks/team';
import { AddMembersFormValues } from '@app/schemas';

export const useMemberManagementPage = (teamMembers: TeamMember[] | [], teamId: string) => {
  const { mutate: addMember, isPending: isAddingMembers } = useAddMembers(teamId);
  const { mutate: removeMember, isPending: isRemovingMember } = useDeleteMember();
  const { mutate: changePosition, isPending: isChangingPosition } = useUpdateMemberPosition();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Position change modal state
  const [isPositionChangeOpen, setIsPositionChangeOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Add member modal state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return teamMembers;

    const searchLower = searchTerm.toLowerCase();
    return teamMembers.filter((member) => {
      const matchesFirstName = member.user.firstName.toLowerCase().includes(searchLower);
      const matchesLastName = member.user.lastName.toLowerCase().includes(searchLower);
      const matchesEmail = member.user.email.toLowerCase().includes(searchLower);
      const matchesPosition = member.position.toLowerCase().includes(searchLower);
      // const matchesSkills = member.skills.some((skill) =>
      //   skill.toLowerCase().includes(searchLower),
      // );
      // const matchesProjects = member.projects.some(
      //   (project) =>
      //     project.name.toLowerCase().includes(searchLower) ||
      //     project.code.toLowerCase().includes(searchLower),
      // );

      return matchesFirstName || matchesLastName || matchesEmail || matchesPosition;
      // || matchesSkills || matchesProjects;
    });
  }, [teamMembers, searchTerm]);

  const handleAddMember = () => {
    setIsAddMemberOpen(true);
  };

  const handleAddMemberConfirm = (formData: AddMembersFormValues) => {
    addMember(formData);
  };

  const closeAddMemberModal = () => {
    setIsAddMemberOpen(false);
  };

  const handleRemoveMember = (memberId: string) => {
    removeMember(memberId);
  };

  const handleChangePosition = (memberId: string) => {
    const teamMember = teamMembers.find((member) => member.id === memberId);
    if (teamMember) {
      setSelectedMember(teamMember);
      setIsPositionChangeOpen(true);
    }
  };

  const handlePositionChangeConfirm = async (memberId: string, newPosition: string) => {
    changePosition({ formData: { position: newPosition }, memberId });
  };

  const closePositionChangeModal = () => {
    setIsPositionChangeOpen(false);
    setSelectedMember(null);
  };

  return {
    members: teamMembers,
    filteredMembers,
    searchTerm,
    viewMode,
    setSearchTerm,
    setViewMode,
    handleRemoveMember,
    isRemovingMember,
    handleChangePosition,
    isChangingPosition,
    // Position change modal
    isPositionChangeOpen,
    selectedMember,
    handlePositionChangeConfirm,
    closePositionChangeModal,
    // Add member modal
    handleAddMember,
    isAddMemberOpen,
    handleAddMemberConfirm,
    closeAddMemberModal,
    isAddingMembers,
  };
};
