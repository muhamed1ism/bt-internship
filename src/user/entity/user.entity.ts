import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../../prisma/generated/role/entities';

export class UserEntity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  status: string;

  @Exclude()
  firebaseUid: string;

  @Exclude()
  roleId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  role: Role;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
