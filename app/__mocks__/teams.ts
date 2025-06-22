import { Team } from '@app/types/team';
import { TeamDetails, TeamMember, MemberStatus } from '@app/types/team-member';

// Mock data for teams
export const MOCK_TEAMS: Team[] = [
  {
    id: 1,
    teamNumber: 1,
    teamLead: { firstName: 'John', lastName: 'Doe' },
    memberCount: 5,
  },
  {
    id: 2,
    teamNumber: 2,
    teamLead: { firstName: 'Jane', lastName: 'Smith' },
    memberCount: 4,
  },
  {
    id: 3,
    teamNumber: 3,
    teamLead: { firstName: 'Michael', lastName: 'Johnson' },
    memberCount: 6,
  },
  {
    id: 4,
    teamNumber: 4,
    teamLead: { firstName: 'Emily', lastName: 'Davis' },
    memberCount: 5,
  },
  {
    id: 5,
    teamNumber: 5,
    teamLead: { firstName: 'David', lastName: 'Wilson' },
    memberCount: 3,
  },
  {
    id: 6,
    teamNumber: 6,
    teamLead: { firstName: 'Sarah', lastName: 'Brown' },
    memberCount: 7,
  },
  {
    id: 7,
    teamNumber: 7,
    teamLead: { firstName: 'Ryan', lastName: 'Taylor' },
    memberCount: 4,
  },
  {
    id: 8,
    teamNumber: 8,
    teamLead: { firstName: 'Lisa', lastName: 'Anderson' },
    memberCount: 5,
  },
];

// Default team for component development
export const DEFAULT_TEAM: Team = {
  id: 0,
  teamNumber: 5,
  teamLead: { firstName: 'firstName', lastName: 'lastName' },
  memberCount: 5,
};

// Status configurations
export const MEMBER_STATUSES: Record<string, MemberStatus> = {
  active: {
    type: 'active',
    label: 'Active',
    color: 'bg-blue-500',
  },
  inProgress: {
    type: 'in-progress',
    label: 'In Progress',
    color: 'bg-orange-500',
  },
  pending: {
    type: 'pending',
    label: 'Pending',
    color: 'bg-yellow-500',
  },
  completed: {
    type: 'completed',
    label: 'Completed',
    color: 'bg-green-500',
  },
  inactive: {
    type: 'inactive',
    label: 'Inactive',
    color: 'bg-gray-500',
  },
};

// Mock team members
const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-001',
    name: 'Jonas Schin',
    email: 'jonas.schin@company.com',
    position: {
      title: 'Team Lead',
      level: 'Senior',
      department: 'Engineering',
      isLead: true,
    },
    status: MEMBER_STATUSES.active,
    skills: ['Leadership', 'React', 'Node.js'],
    joinDate: '2023-01-15',
    lastActivity: '2024-01-15',
  },
  {
    id: 'tm-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    position: {
      title: 'Engineering Manager',
      level: 'Manager',
      department: 'Engineering',
    },
    status: MEMBER_STATUSES.active,
    skills: ['Management', 'Strategy', 'Python'],
    joinDate: '2022-11-20',
    lastActivity: '2024-01-14',
  },
  {
    id: 'tm-003',
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    position: {
      title: 'Tech Lead',
      level: 'Senior',
      department: 'Engineering',
    },
    status: MEMBER_STATUSES.inProgress,
    skills: ['Architecture', 'TypeScript', 'AWS'],
    joinDate: '2023-03-10',
    lastActivity: '2024-01-13',
  },
  {
    id: 'tm-004',
    name: 'Emma Davis',
    email: 'emma.davis@company.com',
    position: {
      title: 'Frontend Developer',
      level: 'Mid',
      department: 'Engineering',
    },
    status: MEMBER_STATUSES.completed,
    skills: ['React', 'CSS', 'JavaScript'],
    joinDate: '2023-06-01',
    lastActivity: '2024-01-12',
  },
  {
    id: 'tm-005',
    name: 'Michael Brown',
    email: 'michael.brown@company.com',
    position: {
      title: 'Project Manager',
      level: 'Senior',
      department: 'Management',
    },
    status: MEMBER_STATUSES.pending,
    skills: ['Project Management', 'Agile', 'Communication'],
    joinDate: '2023-02-28',
    lastActivity: '2024-01-11',
  },
];

// Mock team details
export const MOCK_TEAM_DETAILS: TeamDetails = {
  id: 1,
  teamNumber: 1,
  teamLead: MOCK_TEAM_MEMBERS[0],
  members: MOCK_TEAM_MEMBERS,
  project: {
    id: 'proj-001',
    name: 'Cloud Migration',
    status: 'In Progress',
    startDate: '2024-03-01',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at lorem sed ipsum faucibus euismod. Sed et massa convallis tellus accumsan pharetra.',
    progress: 65,
  },
  stats: {
    totalMembers: 5,
    activeMembers: 4,
    completedTasks: 23,
    inProgressTasks: 8,
  },
};

// =====================================================================
// TECHNOLOGY STACK DEFINITIONS (Backend-Ready)
// =====================================================================

export const TECH_STACKS = {
  react: { id: 'react', name: 'React', color: 'bg-blue-500' },
  nodejs: { id: 'nodejs', name: 'Node.js', color: 'bg-emerald-600' },
  typescript: { id: 'typescript', name: 'TypeScript', color: 'bg-blue-600' },
  python: { id: 'python', name: 'Python', color: 'bg-yellow-600' },
  aws: { id: 'aws', name: 'AWS', color: 'bg-orange-500' },
  docker: { id: 'docker', name: 'Docker', color: 'bg-blue-400' },
  kubernetes: { id: 'kubernetes', name: 'Kubernetes', color: 'bg-blue-700' },
  mongodb: { id: 'mongodb', name: 'MongoDB', color: 'bg-green-500' },
  postgresql: { id: 'postgresql', name: 'PostgreSQL', color: 'bg-blue-800' },
  redis: { id: 'redis', name: 'Redis', color: 'bg-red-500' },
};

// =====================================================================
// TEAM FORM TEMPLATES (Replaces hardcoded formData)
// =====================================================================

// Standard team form template
export const SAMPLE_TEAM_FORM_TEMPLATE = {
  technologies: [TECH_STACKS.react, TECH_STACKS.nodejs],
  client: 'Sample Client',
  status: 'in-progress' as const,
  startDate: '2025-03-19',
  endDate: '2025-06-19',
  projectDescription:
    'This is a comprehensive project that involves building a modern web application using cutting-edge technologies and best practices.',
  projectName: 'Cloud Migration Project',
  githubUrls: [
    'https://github.com/company/cloud-migration',
    'https://github.com/company/migration-scripts',
  ],
  jiraUrls: [
    'https://company.atlassian.net/browse/CM',
    'https://company.atlassian.net/browse/CM-DOCS',
  ],
  budget: 150000,
  priority: 'high' as const,
};

// Enterprise team form template
export const ENTERPRISE_TEAM_FORM_TEMPLATE = {
  technologies: [TECH_STACKS.react, TECH_STACKS.nodejs],
  client: 'Enterprise Client',
  status: 'in-progress' as const,
  startDate: '2025-03-19',
  endDate: '2025-06-19',
  projectDescription: 'Project description',
  projectName: 'Project Name',
  githubUrls: ['https://github.com/company/project', 'https://github.com/company/project-docs'],
  jiraUrls: [
    'https://company.atlassian.net/browse/PROJ',
    'https://company.atlassian.net/browse/PROJ-QA',
  ],
  budget: 200000,
  priority: 'high' as const,
};

// =====================================================================
// HELPER FUNCTIONS (Backend-Ready)
// =====================================================================

/**
 * Creates form data for team editing - ready for backend integration
 * @param team - Team object to create form data for
 * @param template - Template to use ('sample' | 'enterprise')
 * @param projectDetails - Optional project details to override defaults
 */
export const createTeamFormData = (
  team: Team,
  template: 'sample' | 'enterprise' = 'sample',
  projectDetails?: Partial<typeof SAMPLE_TEAM_FORM_TEMPLATE>,
) => {
  const baseTemplate =
    template === 'enterprise' ? ENTERPRISE_TEAM_FORM_TEMPLATE : SAMPLE_TEAM_FORM_TEMPLATE;

  return {
    // Team basic info
    id: team.id,
    name: `Team ${team.teamNumber}`,
    teamNumber: team.teamNumber,

    // Project details from template (easily replaceable with API data)
    ...baseTemplate,

    // Override with any specific project details
    ...projectDetails,
  };
};

/**
 * Creates form data from team details - backend ready
 * @param teamDetails - Team details object
 */
export const createFormDataFromTeamDetails = (teamDetails: TeamDetails) => {
  return {
    id: teamDetails.id,
    name: `Team ${teamDetails.teamNumber}`,
    teamNumber: teamDetails.teamNumber,
    technologies: [TECH_STACKS.react, TECH_STACKS.nodejs],
    client: 'Enterprise Client',
    status: 'in-progress' as const,
    startDate: teamDetails.project?.startDate || '2025-03-19',
    endDate: '2025-06-19',
    projectDescription: teamDetails.project?.description || 'Project description',
    projectName: teamDetails.project?.name || 'Project Name',
    githubUrls: ['https://github.com/company/project', 'https://github.com/company/project-docs'],
    jiraUrls: [
      'https://company.atlassian.net/browse/PROJ',
      'https://company.atlassian.net/browse/PROJ-QA',
    ],
    budget: 200000,
    priority: 'high' as const,
  };
};

export { MOCK_TEAM_MEMBERS };
