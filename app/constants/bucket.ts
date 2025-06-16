import {
  CheckCircle2,
  Clock,
  Star,
  Target,
  Wrench,
  BookOpen,
  Brain,
  TrendingUp,
} from 'lucide-react';
import type { Bucket, DifficultyColorMap, StatusIconMap, SectionIconMap } from '@app/types/bucket';

export const DIFFICULTY_COLORS: DifficultyColorMap = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
  advanced: 'bg-orange-100 text-orange-800 border-orange-200',
  expert: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const STATUS_ICONS = {
  current: Clock,
  completed: CheckCircle2,
  locked: Star,
};

export const SECTION_ICONS = {
  expectations: Target,
  skills: Wrench,
  tools: BookOpen,
  knowledge: Brain,
  toAdvance: TrendingUp,
};

export const MOCK_BUCKETS: Record<string, Bucket> = {
  '1': {
    id: '1',
    title: 'Software Engineer',
    description: 'Full-stack development expertise across modern web technologies',
    totalLevels: 4,
    levels: [
      {
        id: '1',
        levelNumber: 2,
        title: 'Software Engineer Level 2',
        status: 'current',
        difficulty: 'intermediate',
        estimatedTime: '6-12 months',
        prerequisites: ['Software Engineer Level 1'],
        expectations: [
          'Independently lead development of full-stack features, from front-end UI to back-end APIs.',
          'Collaborate with PMs, designers and QA engineers to deliver high quality products.',
          'Mentor junior developers and contribute to code reviews.',
          'Participate in architectural decisions and technical planning sessions.',
        ],
        skills: [
          'Front-End: React.js/Vue, TypeScript, State Management',
          'Back-End: Node.js, Express.js, RESTful APIs',
          'Cloud: AWS Services, Docker, CI/CD',
          'Database: PostgreSQL, MongoDB, Redis',
        ],
        tools: ['React.js', 'Vue', 'Express.js', 'AWS', 'Docker', 'PostgreSQL'],
        knowledge: [
          'In-depth understanding of software architecture, component-based architecture (SOA) and RESTful design',
          'Strong knowledge of JavaScript 3rd party API integrations for a modern web-stack',
          'Understanding of database design principles and query optimization',
          'Familiarity with DevOps practices and deployment strategies',
        ],
        toAdvance: [
          'Lead projects that require full-stack architecture, create shared tools or components that aid overall productivity',
          'Define the skill architecture or solution without structural verification',
          'Work on improving caching solutions by influencing the performance optimizations and quality',
          'Take initiatives by identifying and resolving technical debt across projects',
          'Work closely with the teams to improve quality through building Review and improve user interfaces',
          'Participate in architectural discussions, contributing ideas for scaling or performance',
        ],
      },
      {
        id: '2',
        levelNumber: 3,
        title: 'Senior Software Engineer',
        status: 'locked',
        difficulty: 'advanced',
        estimatedTime: '12-18 months',
        prerequisites: ['Software Engineer Level 2'],
        expectations: ['Lead complex technical initiatives and mentor team members...'],
        skills: ['Advanced system design, microservices architecture...'],
        tools: ['Kubernetes', 'GraphQL', 'Advanced AWS...'],
        knowledge: ['Advanced system architecture and scalability patterns...'],
        toAdvance: ['Demonstrate technical leadership across multiple projects...'],
      },
      {
        id: '3',
        levelNumber: 4,
        title: 'Lead Software Engineer',
        status: 'locked',
        difficulty: 'expert',
        estimatedTime: '18-24 months',
        prerequisites: ['Senior Software Engineer'],
        expectations: ['Drive technical strategy and architecture decisions...'],
        skills: ['System architecture, team leadership, technical strategy...'],
        tools: ['Enterprise tools', 'Architecture patterns...'],
        knowledge: ['Enterprise architecture and organizational impact...'],
        toAdvance: ['Establish technical direction for the engineering organization...'],
      },
      {
        id: '4',
        levelNumber: 5,
        title: 'Principal Software Engineer',
        status: 'locked',
        difficulty: 'expert',
        estimatedTime: '24+ months',
        prerequisites: ['Lead Software Engineer'],
        expectations: ['Set technical vision and influence industry standards...'],
        skills: ['Technical vision, industry expertise, innovation leadership...'],
        tools: ['Cutting-edge technologies', 'Research tools...'],
        knowledge: ['Industry-wide impact and technical innovation...'],
        toAdvance: ['Recognized thought leadership in the engineering community...'],
      },
    ],
  },
};

export const DEFAULT_EDITING_LEVEL = {
  title: '',
  expectations: [''],
  skills: [''],
  tools: [''],
  knowledge: [''],
  toAdvance: [''],
};
