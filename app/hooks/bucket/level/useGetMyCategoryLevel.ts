import { useQuery } from '@tanstack/react-query';
import { getMyCategoryLevelApi } from '@app/api/bucket-api';

export interface UserBucketLevelType {
  userId: string;
  bucketLevelId: string;
  bucket: BucketType;
}

interface BucketType {
  id: string;
  categoryId: string;
  level: number;
  category: CategoryType;
}

interface CategoryType {
  id: string;
  name: string;
}

export const useGetMyCategoryLevel = (categoryId: string, options = {}) => {
  const {
    data: level,
    isLoading,
    isSuccess,
  } = useQuery<UserBucketLevelType>({
    queryKey: ['my-category-level', categoryId],
    queryFn: () => getMyCategoryLevelApi(categoryId),
    enabled: !!categoryId,
    ...options,
  });

  return { level, isLoading, isSuccess };
};
