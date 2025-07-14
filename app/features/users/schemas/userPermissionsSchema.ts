import { z } from 'zod';

export const userPermissionsSchema = z.object({
  assignedRoles: z.array(z.string()),
  customRoleName: z.string().min(1, 'Custom role name is required').optional(),
  selectedPermissions: z.record(z.array(z.string())),
});

export type UserPermissionsFormType = z.infer<typeof userPermissionsSchema>;
