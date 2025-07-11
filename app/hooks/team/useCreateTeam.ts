import { createTeamApi } from '@app/api/team-api';
import { TeamFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';

export const useCreateTeam = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: TeamFormValues) => createTeamApi(formData),
    onSuccess: () => {
      window.location.reload();
    },
  });

  return { mutate, isPending, error };
};
