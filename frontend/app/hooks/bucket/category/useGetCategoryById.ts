import { useQuery } from '@tanstack/react-query';
import { getCategoryByIdApi } from '@app/api/bucket-api';
import { BucketCategory } from '@app/types/bucket';

export const useGetCategoryById = (categoryId: string) => {
  const {
    data: category,
    isLoading,
    isSuccess,
  } = useQuery<BucketCategory | undefined>({
    queryKey: ['get-category-by-id'],
    queryFn: () => getCategoryByIdApi(categoryId),
  });

  return { category, isLoading, isSuccess };
};
