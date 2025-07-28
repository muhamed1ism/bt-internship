import { activateUser } from '@app/api/user-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (userId: string) => activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-user-by-id'] });
      queryClient.invalidateQueries({ queryKey: ['get-all-users'] });
    },
  });

  return { mutate, isPending, error };
};
