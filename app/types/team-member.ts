import { BaseMember, StatusObject, Project } from './shared';

export interface TeamMember extends BaseMember {
  status: StatusObject;
  lastActivity?: string;
}

export interface TeamProject extends Project {
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

// Re-export shared types for backward compatibility
export type {
  Position as TeamPosition,
  StatusObject as MemberStatus,
  ExtendedStatus as MemberStatusType,
} from './shared';
