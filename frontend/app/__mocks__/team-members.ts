import { TeamMemberCard, MemberPosition, MemberProject } from '@app/types/member-management';

// Available positions
export const AVAILABLE_POSITIONS: MemberPosition[] = [
  { title: 'Team Lead', level: 'Senior', department: 'Engineering', isLead: true },
  { title: 'Tech Lead', level: 'Senior', department: 'Engineering' },
  { title: 'Frontend Developer', level: 'Mid', department: 'Engineering' },
  { title: 'Backend Developer', level: 'Mid', department: 'Engineering' },
  { title: 'Full Stack Developer', level: 'Senior', department: 'Engineering' },
  { title: 'Project Manager', level: 'Senior', department: 'Management' },
  { title: 'UI/UX Designer', level: 'Mid', department: 'Design' },
  { title: 'DevOps Engineer', level: 'Senior', department: 'Engineering' },
  { title: 'QA Engineer', level: 'Mid', department: 'Quality Assurance' },
];

// Available projects
export const AVAILABLE_PROJECTS: MemberProject[] = [
  { name: 'Cloud Architecture', code: 'Cloud Arc 6' },
  { name: 'Business Analytics', code: 'Bus An. 5' },
  { name: 'Mobile Development', code: 'Mob Dev 3' },
  { name: 'Data Processing', code: 'Data Proc 4' },
  { name: 'API Gateway', code: 'API Gw 2' },
  { name: 'Frontend Migration', code: 'FE Mig 7' },
  { name: 'Security Audit', code: 'Sec Aud 1' },
];

// Mock team members for member management (different structure from teams.ts)
export const MOCK_TEAM_MEMBER_CARDS: TeamMemberCard[] = [
  {
    id: 'tm-001',
    name: 'Jonas Schn',
    email: 'jonas.schn@company.com',
    position: { title: 'Team Lead', level: 'Senior', department: 'Engineering', isLead: true },
    projects: [
      { name: 'Business Analytics', code: 'Bus An. 5' },
      { name: 'Cloud Architecture', code: 'Cloud Arc 6' },
    ],
    joinDate: '2023-01-15',
    status: 'active',
    skills: ['Leadership', 'React', 'Node.js', 'Team Management'],
  },
  {
    id: 'tm-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    position: { title: 'Tech Lead', level: 'Senior', department: 'Engineering' },
    projects: [
      { name: 'Cloud Architecture', code: 'Cloud Arc 6' },
      { name: 'API Gateway', code: 'API Gw 2' },
    ],
    joinDate: '2022-11-20',
    status: 'active',
    skills: ['Architecture', 'Python', 'AWS', 'System Design'],
  },
  {
    id: 'tm-003',
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    position: { title: 'Frontend Developer', level: 'Mid', department: 'Engineering' },
    projects: [
      { name: 'Business Analytics', code: 'Bus An. 5' },
      { name: 'Frontend Migration', code: 'FE Mig 7' },
    ],
    joinDate: '2023-03-10',
    status: 'active',
    skills: ['React', 'TypeScript', 'CSS', 'UI/UX'],
  },
  {
    id: 'tm-004',
    name: 'Emma Davis',
    email: 'emma.davis@company.com',
    position: { title: 'Project Manager', level: 'Senior', department: 'Management' },
    projects: [
      { name: 'Business Analytics', code: 'Bus An. 5' },
      { name: 'Cloud Architecture', code: 'Cloud Arc 6' },
    ],
    joinDate: '2023-06-01',
    status: 'active',
    skills: ['Project Management', 'Agile', 'Scrum', 'Communication'],
  },
  {
    id: 'tm-005',
    name: 'Michael Brown',
    email: 'michael.brown@company.com',
    position: { title: 'Backend Developer', level: 'Mid', department: 'Engineering' },
    projects: [
      { name: 'API Gateway', code: 'API Gw 2' },
      { name: 'Data Processing', code: 'Data Proc 4' },
    ],
    joinDate: '2023-02-28',
    status: 'active',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'Microservices'],
  },
];
