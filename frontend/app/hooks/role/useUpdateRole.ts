import { updateRoleApi } from '@app/api/role-api';
import { UpdateRoleFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, roleId }: { formData: UpdateRoleFormValues; roleId: string }) =>
      updateRoleApi(formData, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-roles'] });
    },
  });

  return { mutate, isPending, error };
};
