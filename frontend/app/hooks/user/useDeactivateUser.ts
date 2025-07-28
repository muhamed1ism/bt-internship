import { deactivateUser } from '@app/api/user-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDectivateUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (userId: string) => deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-user-by-id'] });
      queryClient.invalidateQueries({ queryKey: ['get-all-users'] });
    },
  });

  return { mutate, isPending, error };
};
