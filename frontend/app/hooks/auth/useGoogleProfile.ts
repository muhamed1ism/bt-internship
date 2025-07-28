import { getCurrentUser } from '@app/lib/firebase';
import routeNames from '@app/routes/route-names';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useGoogleProfile = () => {
  const navigate = useNavigate();
  const { data, isError } = useQuery({
    queryKey: ['google-profile'],
    queryFn: async () => {
      const user = await getCurrentUser();

      const displayName = user?.displayName?.trim().split(' ') || [];
      const firstName = displayName[0] || '';
      const lastName = displayName[1] || '';
      const email = user?.email || '';

      return { firstName, lastName, email };
    },
    staleTime: Infinity,
  });

  if (isError) {
    navigate(routeNames.login());
  }

  return { firstName: data?.firstName, lastName: data?.lastName, email: data?.email };
};
