import { getUserCategoryLevelApi } from '@app/api/bucket-api';
import { BucketLevel } from '@app/types/bucket';
import { useQuery } from '@tanstack/react-query';

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
  description: string;
}

export const useGetUserCategoryLevel = (categoryId: string, options = {}) => {
  const {
    data: level,
    isLoading,
    isSuccess,
  } = useQuery<UserBucketLevelType>({
    queryKey: ['my-category-level', categoryId],
    queryFn: () => getUserCategoryLevelApi(categoryId),
    enabled: !!categoryId,
    ...options,
  });

  return { level, isLoading, isSuccess };
};
