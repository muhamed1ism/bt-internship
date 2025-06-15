import { loginApi } from '@app/api/auth-api';
import { LoginFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: LoginFormValues) => loginApi(formData.email, formData.password),
    onSuccess: () => {
      window.location.reload();
    },
  });

  return { mutate, isPending, error };
};
