import { getAuthHeaders } from '@app/lib/firebase';
import { BASE_URL, ENDPOINTS } from './api-config';
import { User } from '@app/types/types';
import { UpdateProfileFormValues } from '@app/schemas';

export const useGetCurrentUserApi = async (): Promise<User | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.user.current;

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) throw new Error('Error fetching current user');

    return await res.json();
  } catch (error) {
    console.error('Error fetching current user: ', error);
    throw error;
  }
};

export const getUserByIdApi = async (userId: string) => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.user.getById(userId);

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) throw new Error('Error fetching user');

    return await res.json();
  } catch (error) {
    console.error('Error fetching user: ', error);
    throw error;
  }
};

export const getAllUsersApi = async (): Promise<User[] | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.user.allUsers;

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) throw new Error('Unauthorized');

    return await res.json();
  } catch (error) {
    console.error('Error fetching all users: ', error);
    throw error;
  }
};

export const activateUser = async (userId: string) => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.user.activate(userId);

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) throw new Error('Unauthorized');

    return await res.json();
  } catch (error) {
    console.error('Error activating user: ', error);
    throw error;
  }
};

export const deactivateUser = async (userId: string) => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.user.deactivate(userId);

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) throw new Error('Unauthorized');

    return await res.json();
  } catch (error) {
    console.error('Error deactivating user: ', error);
    throw error;
  }
};

export const updateProfileApi = async (profileData: UpdateProfileFormValues) => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.user.updateProfile;

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(profileData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to update profile: ', error);
    throw error;
  }
};
