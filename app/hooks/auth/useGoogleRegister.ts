import { googleRegisterApi } from '@app/api/auth-api';
import routeNames from '@app/routes/route-names';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface FormDataType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  dateOfBirth: Date;
}

export const useGoogleRegister = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: FormDataType) => googleRegisterApi(formData),
    onSuccess: () => {
      navigate(routeNames.dashboard());
    },
  });

  return { mutate, isPending, error };
};
