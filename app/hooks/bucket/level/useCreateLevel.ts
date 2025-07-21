import { createLevelApi } from '@app/api/bucket-api';
import { CreateLevelFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateLevel = (categoryId: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({
      formData,
      categoryId,
    }: {
      formData: CreateLevelFormValues;
      categoryId: string;
    }) => createLevelApi(formData, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-my-category-level', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['get-category-by-id'] });
    },
  });

  return { mutate, isPending, error };
};
