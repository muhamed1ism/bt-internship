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
  bucketDefinition: (params?: Record<string, string>): string =>
    generateRoute('/buckets/:bucketId', params),
  login: (params?: Record<string, string>): string => generateRoute('/login', params),
  register: (params?: Record<string, string>): string => generateRoute('/register', params),
  googleRegister: (params?: Record<string, string>): string =>
    generateRoute('/google-register', params),
  dashboard: (params?: Record<string, string>): string => generateRoute('/dashboard', params),
  evaluation: (params?: Record<string, string>): string => generateRoute('/evaluation', params),
  roles: (params?: Record<string, string>): string => generateRoute('/roles', params),
  teams: (params?: Record<string, string>): string => generateRoute('/teams', params),
  users: (params?: Record<string, string>): string => generateRoute('/users', params),
  people: (params?: Record<string, string>): string => generateRoute('/people', params),
};

export default routeNames;
