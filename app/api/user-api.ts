import { getAuthHeaders } from '@app/lib/firebase';
import { BASE_URL, ENDPOINTS } from './api-config';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  roleId: string;
}

export const currentUserApi = async (): Promise<User | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.user.current;

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) throw new Error('Unauthorized');

    return await res.json();
  } catch (error) {
    console.error('Error fetching current user: ', error);
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
