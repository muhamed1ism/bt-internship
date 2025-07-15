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
  { value: 'PLANNING', label: 'Planning' },
  { value: 'DESIGN', label: 'Design' },
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'IN_REVIEW', label: 'In Review' },
  { value: 'IN_TESTING', label: 'In Testing' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'REWORK_NEEDED', label: 'Rework Needed' },
  { value: 'READY_TO_RELEASE', label: 'Ready to Release' },
  { value: 'DEPLOYED_TO_STAGING', label: 'Deployed to Staging' },
  { value: 'RELEASED', label: 'Released' },
  { value: 'MONITORING', label: 'Monitoring' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
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
