import { TechnologyOption } from '@app/types/team-form';

// Available technologies with colors
export const TECHNOLOGY_OPTIONS: TechnologyOption[] = [
  { value: 'react', label: 'React', color: 'bg-blue-500' },
  { value: 'angular', label: 'Angular', color: 'bg-red-500' },
  { value: 'vue', label: 'Vue.js', color: 'bg-green-500' },
  { value: 'nodejs', label: 'Node.js', color: 'bg-emerald-600' },
  { value: 'python', label: 'Python', color: 'bg-yellow-500' },
  { value: 'java', label: 'Java', color: 'bg-orange-500' },
  { value: 'csharp', label: 'C#', color: 'bg-purple-500' },
  { value: 'php', label: 'PHP', color: 'bg-indigo-500' },
  { value: 'typescript', label: 'TypeScript', color: 'bg-blue-600' },
  { value: 'docker', label: 'Docker', color: 'bg-cyan-500' },
  { value: 'kubernetes', label: 'Kubernetes', color: 'bg-blue-700' },
  { value: 'aws', label: 'AWS', color: 'bg-orange-600' },
];

// Team status options
export const TEAM_STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Priority options
export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-gray-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
];

// Default form values
export const DEFAULT_TEAM_FORM = {
  name: '',
  technologies: [],
  client: '',
  status: 'planning',
  startDate: '',
  endDate: '',
  projectDescription: '',
  projectName: '',
  githubUrls: [''],
  jiraUrls: [''],
  budget: undefined,
  priority: 'medium' as const,
};
