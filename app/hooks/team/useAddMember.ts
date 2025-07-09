import { addMembersApi } from '@app/api/team-api';
import { AddMembersFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddMember = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, teamId }: { formData: AddMembersFormValues; teamId: string }) =>
      addMembersApi(formData, teamId),
    onSuccess: (_, { teamId }) => {
      // Invalidate team members query
      queryClient.invalidateQueries({ queryKey: ['get-team-members', teamId] });
      // Also invalidate all teams to refresh team counts
      queryClient.invalidateQueries({ queryKey: ['get-all-teams'] });
    },
  });

  return { mutate, isPending, error };
};
