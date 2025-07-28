import { updateUserApi } from '@app/api/user-api';
import { UpdateProfileFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ userId, formData }: { userId: string; formData: UpdateProfileFormValues }) =>
      updateUserApi(userId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-user-by-id'] });
      queryClient.invalidateQueries({ queryKey: ['get-all-users'] });
    },
  });

  return { mutate, isPending, error };
};
