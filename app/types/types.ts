export interface UserType {
  password: string;
  linkedin?: string;
  github?: string;
  experienceLevel?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  customRole?: RoleType;
}

export type SortConfig = {
  key: keyof UserType | null;
  direction: SortDirection;
};

export enum SortDirection {
  Ascending = 'ascending',
  Descending = 'descending',
}

export type RoleType = {
  id: string;
  name: string;
  permissions: {
    [category: string]: string[];
  };
};

export interface PersonalInfoFormType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  experienceLevel: experienceLevelType;
  github?: string;
  linkedin?: string;
}

export type UserModalType = 'personal' | 'skills' | 'roles';

export type experienceLevelType = 'intern' | 'junior' | 'medior' | 'senior' | 'lead';
