import { Permission } from './permission.type';

export type Role = {
  id: string;
  name: string;
  description?: string | null;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
};
