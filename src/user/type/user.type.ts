import { Role } from 'src/role/type/role.type';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
};
