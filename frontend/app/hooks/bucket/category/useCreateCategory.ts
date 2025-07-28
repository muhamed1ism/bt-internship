import { createCategoryApi } from '@app/api/bucket-api';
import { CreateCategoryFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: (formData: CreateCategoryFormValues) => createCategoryApi(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-my-buckets'] });
      queryClient.invalidateQueries({ queryKey: ['get-all-categories'] });
      // window.location.reload();
    },
  });

  return { mutate, isPending, isSuccess, error };
};
