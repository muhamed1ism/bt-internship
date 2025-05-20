import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './sidebar/AppSidebar';
import { Topbar } from './topbar/Topbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <SidebarProvider>
      <Topbar />
      <AppSidebar />
      <main className="pt-14 flex-grow">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
