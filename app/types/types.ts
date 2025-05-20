export interface UserType {
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
  dateOfBirth: string;
  phoneNumber: string;
  experienceLevel: 'intern' | 'junior' | 'medior' | 'senior' | 'lead';
  github: string;
  linkedin: string;
}

export type UserModalType = 'personal' | 'skills' | 'roles';
