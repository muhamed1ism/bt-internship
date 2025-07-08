import { useQuery } from '@tanstack/react-query';
import { getMyUserBucketsApi, getAllCategoriesApi } from '@app/api/bucket-api';
import { UserBucketLevel, BucketCategory } from '@app/types/bucket';

interface TransformedBucket {
  id: string;
  title: string;
  currentLevel: number;
  maxLevel: number;
  isActive: boolean;
}

export const useGetMyUserBuckets = () => {
  const {
    data: userBuckets,
    isLoading: isLoadingUserBuckets,
    isSuccess,
    error: userBucketsError,
  } = useQuery<UserBucketLevel[] | undefined>({
    queryKey: ['my-buckets'],
    queryFn: getMyUserBucketsApi,
    retry: 1,
  });

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery<BucketCategory[] | undefined>({
    queryKey: ['bucket-categories'],
    queryFn: getAllCategoriesApi,
    retry: 1,
  });

  const transformedBuckets: TransformedBucket[] | undefined = userBuckets?.map((userBucket) => {
    const category = categories?.find(cat => cat.id === userBucket.bucket.categoryId);
    const maxLevel = category?.bucketLevels?.length || 0;
    
    return {
      id: userBucket.bucket.categoryId,
      title: userBucket.bucket.category.name,
      currentLevel: userBucket.bucket.level,
      maxLevel,
      isActive: true,
    };
  });

  return { 
    buckets: transformedBuckets, 
    isLoading: isLoadingUserBuckets || isLoadingCategories, 
    isSuccess, 
    error: userBucketsError || categoriesError 
  };
};
