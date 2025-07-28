import { Spinner } from '@app/components/ui/spinner';
import { useGetCurrentUser } from '@app/hooks/auth';
import { User } from '@app/types/types';
import { createContext, ReactNode, useContext, useMemo } from 'react';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: globalThis.Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, isLoading, isAuthenticated, error } = useGetCurrentUser();

  const contextValue = useMemo(
    () => ({
      user: user ?? null,
      isLoading,
      isAuthenticated,
      error,
    }),
    [user, isLoading, isAuthenticated, error],
  );

  error?.stack;

  if (isLoading) {
    return (
      <div className="bg-100 text-primary flex h-screen w-full items-center justify-center">
        <Spinner size="large" />
      </div>
    );
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
