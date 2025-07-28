import { promoteUserBucketApi } from '@app/api/bucket-api';
import routeNames from '@app/routes/route-names';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const usePromoteUserBucket = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ userId, categoryId }: { userId: string; categoryId: string }) =>
      promoteUserBucketApi(userId, categoryId),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
