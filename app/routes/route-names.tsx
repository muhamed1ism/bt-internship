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
  people: (params?: Record<string, string>): string => generateRoute('/people', params),
  buckets: (params?: Record<string, string>): string => generateRoute('/buckets', params),
  evaluation: (params?: Record<string, string>): string => generateRoute('/evaluation', params),
  teams: (params?: Record<string, string>): string => generateRoute('/teams', params),
  users: (params?: Record<string, string>): string => generateRoute('/users', params),
  roles: (params?: Record<string, string>): string => generateRoute('/roles', params),
  contact: (params?: Record<string, string>): string => generateRoute('/contact', params),
};

export default routeNames;
