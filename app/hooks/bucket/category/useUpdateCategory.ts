import { updateCategoryApi } from '@app/api/bucket-api';
import routeNames from '@app/routes/route-names';
import { UpdateCategoryFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useUpdateCategory = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({
      formData,
      categoryId,
    }: {
      formData: UpdateCategoryFormValues;
      categoryId: string;
    }) => updateCategoryApi(formData, categoryId),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
