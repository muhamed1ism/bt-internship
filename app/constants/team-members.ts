import { TeamDetails, TeamMember, MemberStatus } from '@app/types/team-member';

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

export { MOCK_TEAM_MEMBERS };
