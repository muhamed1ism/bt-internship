import { deleteLevelApi } from '@app/api/bucket-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteLevel = (categoryId: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (levelId: string) => deleteLevelApi(levelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-my-category-level', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['get-category-by-id'] });
    },
  });

  return { mutate, isPending, error };
};
