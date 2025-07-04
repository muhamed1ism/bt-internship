import { createLevelApi } from '@app/api/bucket-api';
import routeNames from '@app/routes/route-names';
import { CreateLevelFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useCreateLevel = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: CreateLevelFormValues) => createLevelApi(formData),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
