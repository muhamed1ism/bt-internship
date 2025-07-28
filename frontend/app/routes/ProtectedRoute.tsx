import { Navigate } from 'react-router-dom';
import routeNames from './route-names';
import { Layout } from '@app/components/layout/Layout';
import { useAuth } from '@app/context/AuthContext';

export const ProtectedRoute = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to={routeNames.login()} />;
  }

  if (!isLoading && isAuthenticated && user?.status === 'PENDING') {
    return <Navigate to={routeNames.notActivated()} />;
  }

  if (!isLoading && isAuthenticated && user?.status === 'INACTIVE') {
    return <Navigate to={routeNames.deactivated()} />;
  }

  return <Layout />;
};
