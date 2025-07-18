import { getAuthHeaders } from '@app/lib/firebase';
import { BASE_URL, ENDPOINTS } from './api-config';
import { CreateRoleFormValues, UpdateRoleFormValues } from '@app/schemas';

export const getAllRolesApi = async () => {
  const { uri, method } = ENDPOINTS.role.getAllRoles;
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch roles');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch roles: ', error);
    throw error;
  }
};

export const getAllPermissionsApi = async () => {
  const { uri, method } = ENDPOINTS.role.getAllPermissions;
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch permissions');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch permissions: ', error);
    throw error;
  }
};

export const createRoleApi = async (formData: CreateRoleFormValues) => {
  const { uri, method } = ENDPOINTS.role.createRole;
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create role');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create role: ', error);
    throw error;
  }
};

export const updateRoleApi = async (formData: UpdateRoleFormValues, roleId: string) => {
  const { uri, method } = ENDPOINTS.role.updateRole(roleId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update role');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to update role: ', error);
    throw error;
  }
};

export const deleteRoleApi = async (roleId: string) => {
  const { uri, method } = ENDPOINTS.role.deleteRole(roleId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete role');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to delete role: ', error);
    throw error;
  }
};
