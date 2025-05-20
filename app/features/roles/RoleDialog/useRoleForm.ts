// useRoleForm.ts
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoleType } from '@app/types/types';

export const getSchema = (existingNames: string[], currentName = '') =>
  z.object({
    roleName: z
      .string()
      .min(1, 'Role name is required')
      .refine((name) => name === currentName || !existingNames.includes(name.toLowerCase()), {
        message: 'Role name already exists',
      }),
  });

type UseRoleFormProps = {
  allRoles: RoleType[];
  currentName: string;
};

export function useRoleForm({ allRoles, currentName }: UseRoleFormProps) {
  const existingNames = useMemo(
    () =>
      allRoles
        .filter((r) => r.name.toLowerCase() !== currentName.toLowerCase())
        .map((r) => r.name.toLowerCase()),
    [allRoles, currentName],
  );

  const schema = useMemo(() => getSchema(existingNames, currentName), [existingNames, currentName]);

  return useForm<{ roleName: string }>({
    resolver: zodResolver(schema),
    defaultValues: { roleName: '' },
  });
}
