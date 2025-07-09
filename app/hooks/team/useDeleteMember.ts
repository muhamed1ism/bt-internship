import { deleteMemberApi } from '@app/api/team-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      deleteMemberApi(teamId, userId),
    onSuccess: (_, { teamId }) => {
      // Invalidate team members query
      queryClient.invalidateQueries({ queryKey: ['get-team-members', teamId] });
      // Also invalidate all teams to refresh team counts
      queryClient.invalidateQueries({ queryKey: ['get-all-teams'] });
    },
  });

  return { mutate, isPending, error };
};
