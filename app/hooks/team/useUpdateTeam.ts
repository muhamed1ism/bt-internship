import { updateTeamApi } from '@app/api/team-api';
import routeNames from '@app/routes/route-names';
import { TeamFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, teamId }: { formData: TeamFormValues; teamId: string }) =>
      updateTeamApi(formData, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-teams-with-leaders'] });
    },
  });

  return { mutate, isPending, error };
};
