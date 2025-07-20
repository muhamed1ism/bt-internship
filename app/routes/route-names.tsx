const generateRoute = (unsafeRoute: string, params: Record<string, string | null> = {}) => {
  let route = unsafeRoute;
  Object.keys(params).forEach((key) => {
    if (!params[key]) route = route.replace(`/:${key}`, '');
    else route = route.replace(`:${key}`, params[key]);
  });

  return route;
};

const routeNames = {
  root: (params?: Record<string, string>): string => generateRoute('/', params),
  contact: (params?: Record<string, string>): string => generateRoute('/contact', params),
  buckets: (params?: Record<string, string>): string => generateRoute('/buckets', params),
  bucketView: (params?: Record<string, string>): string =>
    generateRoute('/buckets/:bucketId', params),
  login: (params?: Record<string, string>): string => generateRoute('/login', params),
  register: (params?: Record<string, string>): string => generateRoute('/register', params),
  googleRegister: (params?: Record<string, string>): string =>
    generateRoute('/google-register', params),
  dashboard: (params?: Record<string, string>): string => generateRoute('/dashboard', params),
  evaluation: (params?: Record<string, string>): string => generateRoute('/evaluation', params),
  roles: (params?: Record<string, string>): string => generateRoute('/roles', params),
  teams: (params?: Record<string, string>): string => generateRoute('/teams', params),
  teamView: (params?: Record<string, string>): string => generateRoute('/teams/:teamId', params),
  teamMembers: (params?: Record<string, string>): string =>
    generateRoute('/teams/:teamId/members', params),
  teamMembersAdd: (params?: Record<string, string>): string =>
    generateRoute('/teams/:teamId/members/add', params),
  users: (params?: Record<string, string>): string => generateRoute('/users', params),
  people: (params?: Record<string, string>): string => generateRoute('/people', params),
  userDetail: (params?: Record<string, string>): string => generateRoute('/people/:userId', params),
  profile: (params?: Record<string, string>): string => generateRoute('/profile', params),
  reports: (params?: Record<string, string>): string => generateRoute('/reports', params),
  reportDetail: (params?: Record<string, string>): string =>
    generateRoute('/reports/:reportId', params),
  ticketCTO: (params?: Record<string, string>): string => generateRoute('/cto-tickets', params),
  ticketEmployee: (params?: Record<string, string>): string =>
    generateRoute('/employee-tickets', params),
  notAuthorized: (params?: Record<string, string>): string =>
    generateRoute('/not-authorized', params),
};

export default routeNames;
