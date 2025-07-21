import { adminPermissions } from './permissions/adminPermissions';
import { CTOPermissions } from './permissions/CTOPermissions';
import { teamLeadPermissions } from './permissions/teamLeadPermissions';
import { userPermissions } from './permissions/userPermissions';

export const permissionSeedData = [
  {
    admin: [...adminPermissions],
  },
  {
    team_lead: [...teamLeadPermissions],
  },
  {
    user: [...userPermissions],
  },
  {
    cto: [...CTOPermissions],
  },
];

export type PermissionSeedData = typeof permissionSeedData;
