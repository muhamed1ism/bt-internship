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

    const res = await fetch(BASE_URL + ENDPOINTS.user.currentUser.uri, {
      method: ENDPOINTS.user.currentUser.method,
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
