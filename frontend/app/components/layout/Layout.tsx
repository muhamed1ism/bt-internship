import { useAuth } from '@app/context/AuthContext';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './sidebar/AppSidebar';
import { Topbar } from './topbar/Topbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

export const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <SidebarProvider>
      <Topbar />

      {isAuthenticated && <AppSidebar />}

      <main className="flex-grow pt-14">
        <Outlet />
      </main>

      <Toaster />
    </SidebarProvider>
  );
};
