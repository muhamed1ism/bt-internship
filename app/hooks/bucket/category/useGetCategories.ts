import { useQuery } from '@tanstack/react-query';
import { getAllCategoriesApi } from '@app/api/bucket-api';
import { BucketCategory } from '@app/types/bucket';

export const useGetCategories = () => {
  const {
    data: categories,
    isLoading,
    isSuccess,
  } = useQuery<BucketCategory[] | undefined>({
    queryKey: ['categories'],
    queryFn: getAllCategoriesApi,
  });

  return { categories, isLoading, isSuccess };
};
