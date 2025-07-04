import { addMembersApi } from '@app/api/team-api';
import routeNames from '@app/routes/route-names';
import { AddMembersFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useAddMember = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: AddMembersFormValues) => addMembersApi(formData),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
