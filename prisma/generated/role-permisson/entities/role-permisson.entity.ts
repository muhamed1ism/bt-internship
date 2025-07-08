import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';

export class RolePermisson {
  roleId: string;
  permissionId: string;
  assignedAt: Date;
  role?: Role;
  permission?: Permission;
}
