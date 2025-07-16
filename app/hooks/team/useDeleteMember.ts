import { deleteMemberApi } from '@app/api/team-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (memberId: string) => deleteMemberApi(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-team-by-id'] });
    },
  });

  return { mutate, isPending, error };
};
