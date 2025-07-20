import { ExperienceLevel } from './shared';

// User-specific types

export type UserTableRow = User & {
  actions: any;
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  action: string;
  subject: string;
  conditions?: any | null;
  fields?: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfoFormType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  experienceLevel: ExperienceLevel;
  github?: string;
  linkedin?: string;
}

export interface Report {
  id: string;
  content: string;
  userId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  author?: User;
}

// Re-export shared types for backward compatibility
export type {
  Role as RoleType,
  SortConfig,
  UserModalType,
  ExperienceLevel as experienceLevelType,
} from './shared';

// Export enum directly (not as type) so it can be used as value
export { SortDirection } from './shared';
