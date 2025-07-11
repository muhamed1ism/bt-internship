import { deleteTeamApi } from '@app/api/team-api';
import { useMutation } from '@tanstack/react-query';

export const useDeleteTeam = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (teamId: string) => deleteTeamApi(teamId),
    onSuccess: () => {
      window.location.reload();
    },
  });

  return { mutate, isPending, error };
};
