import { unassignUserBucketApi } from '@app/api/bucket-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUnssignUserBucket = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ userId, bucketLevelId }: { userId: string; bucketLevelId: string }) =>
      unassignUserBucketApi(userId, bucketLevelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-user-buckets'] });
    },
  });

  return { mutate, isPending, error };
};
