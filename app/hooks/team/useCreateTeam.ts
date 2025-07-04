import { createTeamApi } from '@app/api/team-api';
import routeNames from '@app/routes/route-names';
import { CreateTeamFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useCreateTeam = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: CreateTeamFormValues) => createTeamApi(formData),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
