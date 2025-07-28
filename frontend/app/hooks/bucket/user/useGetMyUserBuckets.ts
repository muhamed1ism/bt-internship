import { useQuery } from '@tanstack/react-query';
import { getMyUserBucketsApi } from '@app/api/bucket-api';
import { UserBucketLevel } from '@app/types/bucket';

export const useGetMyUserBuckets = () => {
  const {
    data: userBuckets,
    isLoading,
    isSuccess,
  } = useQuery<UserBucketLevel[] | undefined>({
    queryKey: ['get-my-buckets'],
    queryFn: getMyUserBucketsApi,
  });

  return { userBuckets, isLoading, isSuccess };
};
