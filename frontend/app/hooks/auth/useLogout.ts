import { logoutApi } from '@app/api/auth-api';
import { useMutation } from '@tanstack/react-query';

export const useLogout = () => {
  const { mutate } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      window.location.reload();
    },
  });

  return { mutate };
};
