import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { queryClient } from '../utils/query-client.ts';
import routeNames from './route-names.tsx';
import '../main.css';
import AuthProvider from '@app/context/AuthContext.tsx';
import { UnauthenticatedRoute } from './UnauthenticatedRoute.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';
import { Layout } from '@app/components/layout/Layout.tsx';
import { Contact } from '@app/pages/Contact.tsx';
import { Home } from '@app/pages/Home.tsx';
import { Dashboard } from '@app/pages/Dashboard.tsx';
import { Evaluation } from '@app/pages/Evaluation.tsx';
import { People } from '@app/pages/People.tsx';
import { Buckets } from '@app/pages/Buckets.tsx';
import { Roles } from '@app/pages/Roles.tsx';
import { Teams } from '@app/pages/Teams.tsx';
import { Users } from '@app/pages/Users.tsx';
import { Login } from '@app/pages/Login.tsx';
import { Register } from '@app/pages/Register.tsx';
import { GoogleRegister } from '@app/pages/GoogleRegister.tsx';

const routesForPublic = [
  {
    path: '/',
    element: <Layout />,
    children: [{ path: routeNames.contact(), element: <Contact /> }],
  },
];

const routesForNotAuthenticated = [
  {
    path: '/',
    element: <UnauthenticatedRoute />,
    children: [
      { path: routeNames.root(), element: <Home /> },
      { path: routeNames.login(), element: <Login /> },
      { path: routeNames.register(), element: <Register /> },
      { path: routeNames.googleRegister(), element: <GoogleRegister /> },
    ],
  },
];

const routesForAuthenticated = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { path: routeNames.dashboard(), element: <Dashboard /> },
      { path: routeNames.people(), element: <People /> },
      { path: routeNames.buckets(), element: <Buckets /> },
      { path: routeNames.evaluation(), element: <Evaluation /> },
      { path: routeNames.teams(), element: <Teams /> },
      { path: routeNames.users(), element: <Users /> },
      { path: routeNames.roles(), element: <Roles /> },
    ],
  },
];

const router = createBrowserRouter([
  ...routesForNotAuthenticated,
  ...routesForAuthenticated,
  ...routesForPublic,
]);

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
