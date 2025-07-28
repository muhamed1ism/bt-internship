import { registerApi } from '@app/api/auth-api';
import routeNames from '@app/routes/route-names';
import { RegisterFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: RegisterFormValues) => registerApi(formData),
    onSuccess: () => {
      navigate(routeNames.login());
    },
  });

  return { mutate, isPending, error };
};
