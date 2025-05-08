export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  customRole?: RoleType;
}

export interface SortConfig {
  key: keyof UserType | null;
  direction: 'ascending' | 'descending';
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
  experienceLevel: string;
  github: string;
  linkedin: string;
}

export type UserModalType = 'personal' | 'skills' | 'roles';
