import { Role, BaseStatus, ExperienceLevel } from './shared';

// User-specific types

export type UserTableRow = UserType & {
  actions: any;
};

export interface UserType {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  status: string;
  role: UserRoleType;
}

export interface UserRoleType {
  id: string;
  name: string;
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

// Re-export shared types for backward compatibility
export type {
  Role as RoleType,
  SortConfig,
  UserModalType,
  ExperienceLevel as experienceLevelType,
} from './shared';

// Export enum directly (not as type) so it can be used as value
export { SortDirection } from './shared';
