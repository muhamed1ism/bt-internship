import { useQuery } from '@tanstack/react-query';
import { CategorizedPermissions } from '@app/types/shared';
import { getAllPermissionsApi } from '@app/api/role-api';

export const useGetAllPermissions = () => {
  const {
    data: permissions,
    isLoading,
    isSuccess,
  } = useQuery<CategorizedPermissions>({
    queryKey: ['get-all-permissions'],
    queryFn: getAllPermissionsApi,
  });

  return { permissions, isLoading, isSuccess };
};
