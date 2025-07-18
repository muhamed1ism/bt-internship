import { updateProfileApi } from '@app/api/user-api';
import { UpdateProfileFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: UpdateProfileFormValues) => updateProfileApi(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-current-user'] });
    },
  });

  return { mutate, isPending, error };
};
