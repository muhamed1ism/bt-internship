import { useCheckAuth } from '@app/hooks/auth';
import { createContext, ReactNode, useContext, useMemo } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  roleId: string;
}

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, isLoading, isAuthenticated } = useCheckAuth();

  const contextValue = useMemo(
    () => ({
      user: user ?? null,
      isLoading,
      isAuthenticated,
    }),
    [user, isLoading, isAuthenticated],
  );

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
