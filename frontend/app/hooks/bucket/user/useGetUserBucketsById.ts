import { useQuery } from '@tanstack/react-query';
import { getUserBucketsByIdApi } from '@app/api/bucket-api';
import { UserBucketLevel } from '@app/types/bucket';

export const useGetUserBucketsById = (userId: string) => {
  const {
    data: buckets,
    isLoading,
    isSuccess,
  } = useQuery<UserBucketLevel[]>({
    queryKey: ['get-user-buckets', userId],
    queryFn: () => getUserBucketsByIdApi(userId),
    enabled: !!userId,
  });

  return { buckets, isLoading, isSuccess };
};
