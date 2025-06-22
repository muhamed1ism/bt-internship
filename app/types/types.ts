import { Role, BaseStatus, ExperienceLevel } from './shared';

// User-specific types
export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  status: BaseStatus;
  experienceLevel?: ExperienceLevel;
  phoneNumber?: string;
  dateOfBirth?: string;
  linkedin?: string;
  github?: string;
  customRole?: Role;
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
