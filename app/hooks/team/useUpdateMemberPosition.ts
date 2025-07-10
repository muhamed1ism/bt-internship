import { updateMemberPositionApi } from '@app/api/team-api';
import routeNames from '@app/routes/route-names';
import { UpdateMemberPositionFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useUpdateMemberPosition = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({
      formData,
      teamId,
      userId,
    }: {
      formData: UpdateMemberPositionFormValues;
      teamId: string;
      userId: string;
    }) => updateMemberPositionApi(formData, teamId, userId),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
