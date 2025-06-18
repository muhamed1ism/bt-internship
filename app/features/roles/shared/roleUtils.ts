import { roles } from '../../users/fake-data';

// Get combined permissions from multiple roles
export const getCombinedRolePermissions = (roleNames: string[]) => {
  const basePermissions: { [category: string]: string[] } = {};

  roleNames.forEach((roleName) => {
    const role = roles.find((r) => r.name === roleName);
    if (role) {
      Object.entries(role.permissions).forEach(([category, perms]) => {
        if (!basePermissions[category]) {
          basePermissions[category] = [];
        }
        perms.forEach((perm) => {
          if (!basePermissions[category].includes(perm)) {
            basePermissions[category] = [...basePermissions[category], perm];
          }
        });
      });
    }
  });

  return basePermissions;
};

// Check if permissions have been modified from base role permissions
export const hasModifiedPermissions = (
  basePermissions: { [category: string]: string[] },
  selectedPermissions: { [category: string]: string[] },
) => {
  return JSON.stringify(basePermissions) !== JSON.stringify(selectedPermissions);
};
