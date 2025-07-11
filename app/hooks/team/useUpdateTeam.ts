import { updateTeamApi } from '@app/api/team-api';
import routeNames from '@app/routes/route-names';
import { TeamFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useUpdateTeam = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, teamId }: { formData: TeamFormValues; teamId: string }) =>
      updateTeamApi(formData, teamId),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
