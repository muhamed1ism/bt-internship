import { adminPermissions } from './permissions/adminPermissions';
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
];

export type PermissionSeedData = typeof permissionSeedData;
