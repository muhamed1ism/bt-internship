import { z } from 'zod';

const createRoleFormSchema = z.object({
  name: z.string().min(3, 'Role name must be at least 3 characters'),
  description: z.string().optional(),
  permissionIds: z.array(z.string()),
});

const updateRoleFormSchema = z.object({
  name: z.string().min(3, 'Role name must be at least 3 characters'),
  description: z.string().optional(),
  permissionIds: z.array(z.string()),
});

export type CreateRoleFormValues = z.infer<typeof createRoleFormSchema>;
export type UpdateRoleFormValues = z.infer<typeof updateRoleFormSchema>;

export const roleSchema = {
  create: createRoleFormSchema,
  update: updateRoleFormSchema,
};

export default roleSchema;
