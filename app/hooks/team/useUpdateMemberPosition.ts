import { updateMemberPositionApi } from '@app/api/team-api';
import { UpdateMemberPositionFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateMemberPosition = () => {
  const queryClient = useQueryClient();

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
    onSuccess: (_, { teamId }) => {
      // Invalidate team members query
      queryClient.invalidateQueries({ queryKey: ['get-team-members', teamId] });
      // Also invalidate all teams to refresh team data
      queryClient.invalidateQueries({ queryKey: ['get-all-teams'] });
    },
  });

  return { mutate, isPending, error };
};
