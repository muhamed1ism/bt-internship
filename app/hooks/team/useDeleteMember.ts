import { deleteMemberApi } from '@app/api/team-api';
import routeNames from '@app/routes/route-names';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useDeleteMember = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      deleteMemberApi(teamId, userId),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
