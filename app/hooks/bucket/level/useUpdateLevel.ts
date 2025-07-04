import { updateLevelApi } from '@app/api/bucket-api';
import routeNames from '@app/routes/route-names';
import { UpdateLevelFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useUpdateLevel = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, levelId }: { formData: UpdateLevelFormValues; levelId: string }) =>
      updateLevelApi(formData, levelId),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
