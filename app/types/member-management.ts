export interface MemberPosition {
  title: string;
  level: string;
  department: string;
  isLead?: boolean;
}

export interface MemberProject {
  name: string;
  code: string;
  role?: string;
}

export interface TeamMemberCard {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  position: MemberPosition;
  projects: MemberProject[];
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  skills: string[];
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
  position: MemberPosition;
  projects: string[];
  startDate: string;
}

export type ViewMode = 'grid' | 'list';
