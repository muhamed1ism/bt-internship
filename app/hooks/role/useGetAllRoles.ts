import { useQuery } from '@tanstack/react-query';
import { Role } from '@app/types/shared';
import { getAllRolesApi } from '@app/api/role-api';

export const useGetAllRoles = () => {
  const {
    data: roles,
    isLoading,
    isSuccess,
  } = useQuery<Role[]>({
    queryKey: ['get-all-roles'],
    queryFn: getAllRolesApi,
  });

  return { roles, isLoading, isSuccess };
};
