export interface Technology {
  id: string;
  name: string;
  color: string;
}

export interface TeamFormData {
  name: string;
  technologies: Technology[];
  client: string;
  status: string;
  startDate: string;
  endDate?: string;
  projectDescription: string;
  projectName: string;
  githubUrls: string[];
  jiraUrls: string[];
  budget?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface TeamFormProps {
  team?: TeamFormData & { id?: number };
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeamFormData) => void;
  onRemove?: (teamId: number) => void;
  mode: 'create' | 'edit';
}

export type TeamStatus = 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';

export interface TechnologyOption {
  value: string;
  label: string;
  color: string;
}
