import { loginApi } from '@app/api/auth-api';
import { useMutation } from '@tanstack/react-query';

interface FormDataType {
  email: string;
  password: string;
}

export const useLogin = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: FormDataType) => loginApi(formData.email, formData.password),
    onSuccess: () => {
      window.location.reload();
    },
  });

  return { mutate, isPending, error };
};
