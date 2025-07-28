import { useQuery } from '@tanstack/react-query';
import { getAllCategoryLevelsApi } from '@app/api/bucket-api';
import { BucketLevel } from '@app/types/bucket';

export const useGetCategoryLevels = (categoryId: string, options = {}) => {
  const {
    data: levels,
    isLoading,
    isSuccess,
    isError,
  } = useQuery<BucketLevel[]>({
    queryKey: ['category-levels', categoryId],
    queryFn: () => getAllCategoryLevelsApi(categoryId),
    enabled: !!categoryId,
    ...options,
  });

  return { levels, isLoading, isSuccess, isError };
};
