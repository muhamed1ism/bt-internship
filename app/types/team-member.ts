export interface TeamMember {
  id: string;
  name: string;
  email: string;
  position: TeamPosition;
  status: MemberStatus;
  avatar?: string;
  skills: string[];
  joinDate: string;
  lastActivity?: string;
}

export interface TeamPosition {
  title: string;
  level: string;
  department: string;
  isLead?: boolean;
}

export interface MemberStatus {
  type: 'active' | 'in-progress' | 'pending' | 'completed' | 'inactive';
  label: string;
  color: string;
}

export interface TeamProject {
  id: string;
  name: string;
  status: string;
  startDate: string;
  description: string;
  progress: number;
}

export interface TeamDetails {
  id: number;
  teamNumber: number;
  teamLead: TeamMember;
  members: TeamMember[];
  project?: TeamProject;
  stats: {
    totalMembers: number;
    activeMembers: number;
    completedTasks: number;
    inProgressTasks: number;
  };
}

export interface MemberCardProps {
  member: TeamMember;
  onSubmitReport?: (memberId: string) => void;
  onChangePosition?: (memberId: string) => void;
}

export type MemberStatusType = 'active' | 'in-progress' | 'pending' | 'completed' | 'inactive';
