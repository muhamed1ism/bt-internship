import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@app/types/types';
import { userPermissionsSchema, UserPermissionsFormType } from '../schemas/userPermissionsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePermissionManager } from '../../roles/hooks';
import { getCombinedRolePermissions } from '../../roles/utils/roleUtils';

export function useUserPermissions(user: User | null) {
  const { selectedPermissions, setSelectedPermissions, activeTab, setActiveTab, resetPermissions } =
    usePermissionManager();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserPermissionsFormType>({
    mode: 'onTouched',
    resolver: zodResolver(userPermissionsSchema),
    defaultValues: {
      assignedRoles: [],
      customRoleName: '',
      selectedPermissions: {},
    },
  });

  // Use shared utility function
  const getBaseRolePermissions = getCombinedRolePermissions;

  useEffect(() => {
    if (user) {
      const assignedRoles = user.role ? [user.role] : [];
      const customRoleName = user.customRole?.name || `${user.firstName}'s Custom Role`;
      const userPermissions = user.customRole?.permissions || {};

      reset({
        assignedRoles,
        customRoleName,
        selectedPermissions: userPermissions,
      });

      resetPermissions(userPermissions);
    }
  }, [user?.id, user?.role, user?.customRole, user?.firstName, reset, resetPermissions]);

  const updateSelectedPermissions = (permissions: { [category: string]: string[] }) => {
    setSelectedPermissions(permissions);
    setValue('selectedPermissions', permissions);
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    errors,
    selectedPermissions,
    setSelectedPermissions: updateSelectedPermissions,
    activeTab,
    setActiveTab,
    getBaseRolePermissions,
  };
}
