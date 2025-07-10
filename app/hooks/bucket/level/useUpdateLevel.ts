import { updateLevelApi } from '@app/api/bucket-api';
import { UpdateLevelFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';

export const useUpdateLevel = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, levelId }: { formData: UpdateLevelFormValues; levelId: string }) =>
      updateLevelApi(formData, levelId),
    onSuccess: () => {
      window.location.reload();
    },
  });

  return { mutate, isPending, error };
};
