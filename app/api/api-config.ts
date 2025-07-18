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
    getById: (userId: string) => ({
      uri: `/user/${userId}`,
      method: 'GET',
    }),
    allUsers: {
      uri: '/user/all',
      method: 'GET',
    },
    updateProfile: {
      uri: '/user/profile',
      method: 'PUT',
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
    getById: (reportId: string) => ({
      uri: `/report/${reportId}`,
      method: 'GET',
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
    getAllWithLeaders: {
      uri: '/team/all-with-leaders',
      method: 'GET',
    },
    getTeamById: (teamId: string) => ({
      uri: `/team/${teamId}`,
      method: 'GET',
    }),
    getUserTeams: {
      uri: '/team/user',
      method: 'GET',
    },

    member: {
      get: (teamId: string) => ({
        uri: `/team/member/${teamId}/all`,
        method: 'GET',
      }),
      getTeamLeaders: (teamId: string) => ({
        uri: `/team/member/${teamId}/team-leaders`,
        method: 'GET',
      }),
      getAvailableUsers: (teamId: string) => ({
        uri: `/team/member/${teamId}/available-users`,
        method: 'GET',
      }),
      add: (teamId: string) => ({
        uri: `/team/member/${teamId}/add`,
        method: 'POST',
      }),
      updatePosition: (memberId: string) => ({
        uri: `/team/member/update-position/${memberId}`,
        method: 'PUT',
      }),
      delete: (memberId: string) => ({
        uri: `/team/member/delete/${memberId}`,
        method: 'DELETE',
      }),
    },
  },

  ticket: {
    getAll: {
      uri: '/tickets/all',
      method: 'GET',
    },
    getMy: {
      uri: '/tickets/my',
      method: 'GET',
    },
    getMessages: (ticketId: string) => ({
      uri: `/tickets/${ticketId}/messages`,
      method: 'GET',
    }),
    create: (employeeId: string) => ({
      uri: `/tickets/${employeeId}`,
      method: 'POST',
    }),
    createMessage: (ticketId: string) => ({
      uri: `/tickets/${ticketId}/messages`,
      method: 'POST',
    }),
    markAwaitingConfirmation: (ticketId: string) => ({
      uri: `/tickets/${ticketId}/mark-awaiting-confirmation`,
      method: 'PUT',
    }),
    markFinished: (ticketId: string) => ({
      uri: `/tickets/${ticketId}/mark-finished`,
      method: 'PUT',
    }),
  },

  role: {
    getAllRoles: {
      uri: '/roles',
      method: 'GET',
    },
    getAllPermissions: {
      uri: '/roles/permissions',
      method: 'GET',
    },
    createRole: {
      uri: '/roles',
      method: 'POST',
    },
    updateRole: (roleId: string) => ({
      uri: `/roles/${roleId}`,
      method: 'PUT',
    }),
    deleteRole: (roleId: string) => ({
      uri: `/roles/${roleId}`,
      method: 'DELETE',
    }),
  },
};
