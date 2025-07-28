import { deleteRoleApi } from '@app/api/role-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (roleId: string) => deleteRoleApi(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-roles'] });
    },
  });

  return { mutate, isPending, error };
};
