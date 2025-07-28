import { deleteTeamApi } from '@app/api/team-api';
import routeNames from '@app/routes/route-names';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useDeleteTeam = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (teamId: string) => deleteTeamApi(teamId),
    onSuccess: () => {
      navigate(routeNames.teams());
      queryClient.invalidateQueries({ queryKey: ['get-all-teams-with-leaders'] });
    },
  });

  return { mutate, isPending, error };
};
