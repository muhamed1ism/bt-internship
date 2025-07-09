export interface TeamLead {
  firstName: string;
  lastName: string;
}

export interface Team {
  id: number;
  teamNumber: number;
  teamLead: TeamLead;
  memberCount?: number;
}

// Backend response types based on API documentation
export interface BackendTeam {
  id: string;
  name: string;
  clientName: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  startDate: string;
  endDate?: string;
  projectDescription: string;
  documentation: string;
  githubLink: string;
  createdAt: string;
  updatedAt: string;
  technologies: Array<{
    id: string;
    name: string;
  }>;
  members: BackendTeamMember[];
}

export interface BackendTeamMember {
  id: string;
  position: string;
  joinedAt: string;
  userId: string;
  teamId: string;
  // Note: user object is not included in the response - it's in a separate table
}

export interface TransformedTeam {
  id: number;
  teamNumber: number;
  teamLead: TeamLead;
  memberCount: number;
  name: string;
  status: string;
  clientName: string;
  technologies: string[];
}

export interface TeamCardProps {
  teamNumber: number;
  teamLead: TeamLead;
  viewMode?: 'grid' | 'list';
  memberCount?: number;
  onView?: () => void;
  onEdit?: () => void;
}

export type ViewMode = 'grid' | 'list';
