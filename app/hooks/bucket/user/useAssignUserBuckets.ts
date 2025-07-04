import { assignUserBucketsApi } from '@app/api/bucket-api';
import routeNames from '@app/routes/route-names';
import { AssignUserBucketsFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useAssignUserBuckets = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, userId }: { formData: AssignUserBucketsFormValues; userId: string }) =>
      assignUserBucketsApi(formData, userId),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
