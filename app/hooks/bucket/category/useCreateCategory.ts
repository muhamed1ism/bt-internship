import { createCategoryApi } from '@app/api/bucket-api';
import routeNames from '@app/routes/route-names';
import { CreateCategoryFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useCreateCategory = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: CreateCategoryFormValues) => createCategoryApi(formData),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
