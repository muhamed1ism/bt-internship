import { googleSignInApi } from '@app/api/auth-api';
import { auth } from '@app/lib/firebase';
import routeNames from '@app/routes/route-names';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useGoogleSignIn = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: googleSignInApi,
    onSuccess: (data) => {
      console.log({ data });
      if (data.hasAccount === true) {
        navigate(routeNames.dashboard());
        window.location.reload();
      } else {
        navigate(routeNames.googleRegister());
        window.location.reload();
      }
    },
    onError: () => {
      auth.signOut();
    },
  });

  return { mutate, isPending };
};
