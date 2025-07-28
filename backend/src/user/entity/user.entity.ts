import { Exclude, Expose, Type } from 'class-transformer';
import { RoleEntity } from 'src/role/entity/role.entity';

export class UserEntity {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => RoleEntity)
  role: RoleEntity;

  @Exclude()
  firebaseUid: string;

  @Exclude()
  roleId: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
