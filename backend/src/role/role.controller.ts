import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('permissions')
  async getAllPermissions() {
    return this.roleService.getGroupedPermissins();
  }

  @Get(':roleId/permissions')
  async getRolePermissions(@Param('roleId') roleId: string) {
    return this.roleService.getRolePermissions(roleId);
  }

  @Get()
  async findAll() {
    return this.roleService.getAllRoles();
  }

  @Post()
  async create(@Body() roleData: CreateRoleDto) {
    return this.roleService.createRole(roleData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() roleData: UpdateRoleDto) {
    return this.roleService.updateRole(id, roleData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
