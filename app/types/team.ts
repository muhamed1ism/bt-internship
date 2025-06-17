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

export interface TeamCardProps {
  teamNumber: number;
  teamLead: TeamLead;
  viewMode?: 'grid' | 'list';
  memberCount?: number;
  onView?: () => void;
  onEdit?: () => void;
}

export type ViewMode = 'grid' | 'list';
