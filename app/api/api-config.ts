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
  },

  user: {
    current: {
      uri: '/user/current-user',
      method: 'GET',
    },
    allUsers: {
      uri: '/user/all',
      method: 'GET',
    },
    activate: (userId: string) => ({
      uri: `user/${userId}/activate`,
      method: 'PUT',
    }),
    deactivate: (userId: string) => ({
      uri: `user/${userId}/deactivate`,
      method: 'PUT',
    }),
  },

  bucket: {
    category: {
      getAll: {
        uri: '/bucket/category/all',
        method: 'GET',
      },
      getById: (categoryId: string) => ({
        uri: `/bucket/category/${categoryId}`,
        method: 'GET',
      }),
      create: {
        uri: '/bucket/category/create',
        method: 'POST',
      },
      update: (categoryId: string) => ({
        uri: `/bucket/category/update/${categoryId}`,
        method: 'PUT',
      }),
      delete: (categoryId: string) => ({
        uri: `/bucket/category/delete/${categoryId}`,
        method: 'DELETE',
      }),
    },

    level: {
      getAll: (categoryId: string) => ({
        uri: `/bucket/level/all/${categoryId}`,
        method: 'GET',
      }),
      getUserLevel: (categoryId: string) => ({
        uri: `/bucket/level/user/${categoryId}`,
        method: 'GET',
      }),
      create: (categoryId: string) => ({
        uri: `/bucket/level/create/${categoryId}`,
        method: 'POST',
      }),
      update: (levelId: string) => ({
        uri: `/bucket/level/update/${levelId}`,
        method: 'PUT',
      }),
      delete: (levelId: string) => ({
        uri: `/bucket/level/delete/${levelId}`,
        method: 'DELETE',
      }),
    },

    user: {
      getByUserId: (userId: string) => ({
        uri: `/user/bucket/${userId}`,
        method: 'GET',
      }),
      getMy: {
        uri: '/user/bucket/my',
        method: 'GET',
      },
      assign: (userId: string) => ({
        uri: `/user/bucket/${userId}/assign`,
        method: 'POST',
      }),
      promote: (userId: string, categoryId: string) => ({
        uri: `/user/bucket/${userId}/promote/${categoryId}`,
        method: 'PUT',
      }),
    },
  },

  report: {
    add: (userId: string) => ({
      uri: `/report/add/${userId}`,
      method: 'POST',
    }),
    update: (reportId: string) => ({
      uri: `/report/update/${reportId}`,
      method: 'PUT',
    }),
    delete: (reportId: string) => ({
      uri: `/report/delete/${reportId}`,
      method: 'DELETE',
    }),
    getByUserId: (userId: string) => ({
      uri: `/report/${userId}`,
      method: 'GET',
    }),
    getUserReports: {
      uri: '/report/user',
      method: 'GET',
    },
    getAuthorReports: {
      uri: '/report/author',
      method: 'GET',
    },
  },

  team: {
    add: {
      uri: '/team/add',
      method: 'POST',
    },
    update: (teamId: string) => ({
      uri: `/team/update/${teamId}`,
      method: 'PUT',
    }),
    delete: (teamId: string) => ({
      uri: `/team/delete/${teamId}`,
      method: 'DELETE',
    }),
    getAll: {
      uri: '/team/all',
      method: 'GET',
    },
    getUserTeams: {
      uri: '/team/user',
      method: 'GET',
    },

    member: {
      get: (teamId: string) => ({
        uri: `/team/member/${teamId}/all`,
        method: 'GET',
      }),
      add: (teamId: string) => ({
        uri: `/team/member/${teamId}/add`,
        method: 'POST',
      }),
      updatePosition: (teamId: string, userId: string) => ({
        uri: `/team/member/${teamId}/update-position/${userId}`,
        method: 'PUT',
      }),
      delete: (teamId: string, userId: string) => ({
        uri: `/team/member/${teamId}/delete/${userId}`,
        method: 'DELETE',
      }),
    },
  },
};
