import { googleRegisterApi } from '@app/api/auth-api';
import routeNames from '@app/routes/route-names';
import { RegisterFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useGoogleRegister = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: RegisterFormValues) => googleRegisterApi(formData),
    onSuccess: () => {
      navigate(routeNames.dashboard());
    },
  });

  return { mutate, isPending, error };
};
