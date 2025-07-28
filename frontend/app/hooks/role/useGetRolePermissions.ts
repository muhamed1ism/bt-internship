import { getRolePermissionsApi } from '@app/api/role-api';
import { CategorizedPermissions } from '@app/types/shared';
import { useQuery } from '@tanstack/react-query';

export const useGetRolePermissions = (roleId: string) => {
  const {
    data: rolePermissions,
    isLoading,
    isSuccess,
    error,
  } = useQuery<CategorizedPermissions>({
    queryKey: ['get-permissions-by-role-id'],
    queryFn: () => getRolePermissionsApi(roleId),
  });

  return { rolePermissions, isLoading, isSuccess, error };
};
