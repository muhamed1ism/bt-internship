import { updateUserRoleApi } from '@app/api/user-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      updateUserRoleApi(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-users'] });
      queryClient.invalidateQueries({ queryKey: ['get-permissions-by-role-id'] });
    },
  });

  return { mutate, isPending, error };
};
