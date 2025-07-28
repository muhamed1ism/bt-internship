import { createRoleApi } from '@app/api/role-api';
import { CreateRoleFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: CreateRoleFormValues) => createRoleApi(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-roles'] });
    },
  });

  return { mutate, isPending, error };
};
