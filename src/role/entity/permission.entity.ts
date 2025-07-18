import { Exclude, Expose } from 'class-transformer';

export class PermissionEntity {
  @Expose()
  id: string;

  @Expose()
  action: string;

  @Expose()
  subject: string;

  @Expose()
  conditions?: any | null;

  @Expose()
  fields?: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  conditionHash: string | null;

  @Exclude()
  fieldsHash: string | null;

  constructor(partial: Partial<PermissionEntity>) {
    Object.assign(this, partial);
  }
}
