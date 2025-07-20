import { useQuery } from '@tanstack/react-query';
import { getUserBucketsByIdApi } from '@app/api/bucket-api';

export const useGetUserBucketsById = (userId: string) => {
  const {
    data: buckets,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['user-buckets', userId],
    queryFn: () => getUserBucketsByIdApi(userId),
    enabled: !!userId,
  });

  return { buckets, isLoading, isSuccess };
};
