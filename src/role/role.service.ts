import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPermissions() {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [{ subject: 'desc' }, { action: 'asc' }],
    });

    if (!permissions) throw new NotFoundException('Permissions not found');

    return permissions;
  }

  async getGroupedPermissins() {
    const permissions = await this.getAllPermissions();
    const grouped = {};

    if (!permissions) throw new NotFoundException('Permissions not found');

    for (const perm of permissions) {
      if (!grouped[perm.subject]) grouped[perm.subject] = [];
      grouped[perm.subject].push(perm);
    }

    return grouped;
  }

  async getAllRoles() {
    return this.prisma.role.findMany({
      include: { permissions: true },
    });
  }

  async createRole(dto: CreateRoleDto) {
    return this.prisma.role.create({
      data: {
        name: dto.name,
        description: dto.description,
        isDefault: dto.isDefault || false,
        permissions: {
          connect: dto.permissionIds.map((id) => ({ id })),
        },
      },
      include: { permissions: true },
    });
  }

  async updateRole(roleId: string, dto: UpdateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    });

    if (!existing) throw new NotFoundException('Role not found');

    // Sync permissions
    if (dto.permissionIds) {
      const currentPermissionIds = existing.permissions.map((p) => p.id);
      const toDisconnect = currentPermissionIds.filter(
        (id) => !dto.permissionIds?.includes(id),
      );
      const toConnect = dto.permissionIds.filter(
        (id) => !currentPermissionIds.includes(id),
      );

      return this.prisma.role.update({
        where: { id: roleId },
        data: {
          name: dto.name,
          description: dto.description,
          isDefault: dto.isDefault,
          permissions: {
            disconnect: toDisconnect.map((id) => ({ id })),
            connect: toConnect.map((id) => ({ id })),
          },
        },
        include: { permissions: true },
      });
    }

    // If no permissions update, just update fields
    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        name: dto.name,
        description: dto.description,
        isDefault: dto.isDefault,
      },
      include: { permissions: true },
    });
  }

  async deleteRole(roleId: string) {
    return this.prisma.role.delete({ where: { id: roleId } });
  }
}
