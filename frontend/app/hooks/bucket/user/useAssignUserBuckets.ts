import { assignUserBucketsApi } from '@app/api/bucket-api';
import { AssignUserBucketsFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAssignUserBuckets = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, userId }: { formData: AssignUserBucketsFormValues; userId: string }) =>
      assignUserBucketsApi(formData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-user-buckets'] });
    },
  });

  return { mutate, isPending, error };
};
