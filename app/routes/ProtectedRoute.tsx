import { Navigate } from 'react-router-dom';
import routeNames from './route-names';
import { Layout } from '@app/components/layout/Layout';
import { useAuth } from '@app/context/AuthContext';

export const ProtectedRoute = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to={routeNames.login()} />;
  }

  return <Layout />;
};
