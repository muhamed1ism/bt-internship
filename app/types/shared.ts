// Shared types used across multiple features
// This file eliminates duplicate type definitions

import { UserType } from './types';

// Common position interface - used by both team members and member management
export interface Position {
  title: string;
  level: string;
  department: string;
  isLead?: boolean;
}

// Common project interface
export interface Project {
  id: string;
  name: string;
  code?: string; // Optional for different use cases
  status?: string;
  startDate?: string;
  description?: string;
  progress?: number;
  role?: string; // Role of member in this project
}

// Standardized status types
export type BaseStatus = 'active' | 'inactive' | 'pending';
export type ExtendedStatus = BaseStatus | 'in-progress' | 'completed';

// Status object with display properties
export interface StatusObject {
  type: ExtendedStatus;
  label: string;
  color: string;
}

// Common member interface base
export interface BaseMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  position: Position;
  skills: string[];
  joinDate: string;
}

// View mode type (used in multiple places)
export type ViewMode = 'grid' | 'list';

// Common sorting types
export enum SortDirection {
  Ascending = 'ascending',
  Descending = 'descending',
}

export type SortConfig<T = Record<string, unknown>> = {
  key: keyof T | null;
  direction: SortDirection;
};

// Role type - centralized definition
export interface Role {
  id: string;
  name: string;
  description?: string;
  users: UserType[];
  permissions: Permission[];
}

export interface Permission {
  id: string;
  action: string;
  subject: string;
  conditions?: Record<string, any> | null;
  fields: string[];
  reason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CategorizedPermissions = Record<string, Permission[]>;

// Experience level type
export type ExperienceLevel = 'intern' | 'junior' | 'medior' | 'senior' | 'lead';

// Modal types
export type UserModalType = 'personal' | 'skills' | 'roles';

// User card types
export interface Skill {
  title: string;
  level: number;
}

export interface Goal {
  title: string;
  level: number;
}

export interface UserCardProps {
  name: string;
  avatarUrl: string;
  skills: Skill[];
  currentGoals: Goal[];
}
