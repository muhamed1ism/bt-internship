import { getAuthHeaders } from '@app/lib/firebase';
import { BASE_URL, ENDPOINTS } from './api-config';
import { UserType } from '@app/types/types';

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

export const getAllUsersApi = async (): Promise<UserType[] | null> => {
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

export const updateUserProfileApi = async (profileData: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}) => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.user.updateProfile;

    console.log('Profile update request URL:', BASE_URL + uri);
    console.log('Profile update request method:', method);
    console.log('Profile update request headers:', authHeaders);
    console.log('Profile update request body:', profileData);

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(profileData),
    });

    if (!res.ok) {
      console.log('Profile update response status:', res.status);
      console.log('Profile update response headers:', res.headers);
      
      let errorMessage = 'Failed to update profile';
      try {
        const error = await res.json();
        console.log('Profile update error response:', error);
        errorMessage = error.message || errorMessage;
      } catch (parseError) {
        console.log('Could not parse profile update error response:', parseError);
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to update profile: ', error);
    throw error;
  }
};
