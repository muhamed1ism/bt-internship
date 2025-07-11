import { addMembersApi } from '@app/api/team-api';
import { AddMembersFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useAddMembers = (teamId: string) => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: AddMembersFormValues) => addMembersApi(formData, teamId),
    onSuccess: () => {
      navigate(`/teams/${teamId}/members`);
    },
  });

  return { mutate, isPending, error };
};
