import { updateCategoryApi } from '@app/api/bucket-api';
import { UpdateCategoryFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({
      formData,
      categoryId,
    }: {
      formData: UpdateCategoryFormValues;
      categoryId: string;
    }) => updateCategoryApi(formData, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-category-by-id'] });
      queryClient.invalidateQueries({ queryKey: ['my-category-level'] });
    },
  });

  return { mutate, isPending, error };
};
