import { registerApi } from '@app/api/auth-api';
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

export const useRegister = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: FormDataType) => registerApi(formData),
    onSuccess: () => {
      navigate(routeNames.login());
    },
  });

  return { mutate, isPending, error };
};
