import { Role } from 'prisma/generated/role/entities';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  status: string;
  role: Role;
};
