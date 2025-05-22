export const BASE_URL = import.meta.env.VITE_API_URL + '/api';

export const ENDPOINTS = {
  auth: {
    register: {
      uri: '/auth/register',
      method: 'POST',
    },
    googleSignIn: {
      uri: '/auth/google-signin',
      method: 'GET',
    },
    googleRegister: {
      uri: '/auth/google-register',
      method: 'POST',
    },
    currentUser: {
      uri: '/user/current-user',
      method: 'GET',
    },
  },
};
