import { Exclude, Expose, Type } from 'class-transformer';
import { PermissionEntity } from './permission.entity';

export class RoleEntity {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string | null;

  @Expose()
  @Type(() => PermissionEntity)
  permissions: PermissionEntity[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  isDefault: boolean;

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}
