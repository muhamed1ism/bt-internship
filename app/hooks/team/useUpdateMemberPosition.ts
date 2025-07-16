import { updateMemberPositionApi } from '@app/api/team-api';
import { UpdateMemberPositionFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateMemberPosition = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({
      formData,
      memberId,
    }: {
      formData: UpdateMemberPositionFormValues;
      memberId: string;
    }) => updateMemberPositionApi(formData, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-team-by-id'] });
    },
  });

  return { mutate, isPending, error };
};
