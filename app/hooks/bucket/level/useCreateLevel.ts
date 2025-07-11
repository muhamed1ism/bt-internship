import { createLevelApi } from '@app/api/bucket-api';
import { CreateLevelFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';

export const useCreateLevel = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({
      formData,
      categoryId,
    }: {
      formData: CreateLevelFormValues;
      categoryId: string;
    }) => createLevelApi(formData, categoryId),
    onSuccess: () => {
      window.location.reload();
    },
  });

  return { mutate, isPending, error };
};
