import { BaseMember, Position, BaseStatus, Project } from './shared';

export interface MemberProject extends Pick<Project, 'name' | 'code' | 'role'> {
  name: string;
  code: string;
  role?: string;
}

export interface TeamMemberCard extends BaseMember {
  projects: MemberProject[];
  status: BaseStatus;
}

export interface MemberManagementProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  teamName: string;
  members: TeamMemberCard[];
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
  onChangePosition: (memberId: string) => void;
}

export interface AddMemberFormData {
  name: string;
  email: string;
  position: Position;
  projects: string[];
  startDate: string;
}

// Re-export shared types for backward compatibility
export type { Position as MemberPosition, ViewMode } from './shared';
