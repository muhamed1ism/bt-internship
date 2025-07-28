import { User } from './types';

export interface Team {
  id: string;
  name: string;
  clientName: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  projectDescription: string;
  documentation: string;
  githubLink: string;
  createdAt: Date;
  updatedAt: Date;
  _count: TeamCount;
  members?: TeamMember[] | [];
  technologies?: TeamTechnology[] | [];
}

export interface TeamCount {
  technologies: number;
  members: number;
}

export interface TeamMember {
  id: string;
  position: string;
  joinedAt: Date;
  teamId: string;
  user: User;
}

export interface TeamTechnology {
  id: string;
  name: string;
}

export interface TeamCardProps {
  teamName: string;
  teamLeaders: TeamMember[] | [];
  viewMode?: 'grid' | 'list';
  memberCount?: number;
  onView?: () => void;
  onEdit?: () => void;
}

export type ViewMode = 'grid' | 'list';

export interface MemberCardProps {
  member: TeamMember;
  onSubmitReport?: (memberId: string) => void;
  onChangePosition?: (memberId: string) => void;
  viewMode?: string;
}
