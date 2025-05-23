export const BASE_URL = import.meta.env.VITE_API_URL + '/api';

export const ENDPOINTS = {
  auth: {
    register: {
      uri: '/auth/register',
      method: 'POST',
    },
    currentUser: {
      uri: '/auth/current-user',
      method: 'GET',
    },
  },
};
