import {
  BookUser,
  ClipboardCheck,
  Contact,
  Home,
  Layers,
  ShieldUser,
  UserRound,
  UserRoundSearch,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../../ui/sidebar';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { SidebarButton } from './SidebarButton';
import routeNames from '@app/routes/route-names';

const items = [
  { title: 'Dashboard', url: routeNames.dashboard(), icon: <Home /> },
  { title: 'People', url: routeNames.people(), icon: <UserRoundSearch /> },
  { title: 'Buckets', url: routeNames.buckets(), icon: <Layers /> },
  { title: 'Evaluation', url: routeNames.evaluation(), icon: <ClipboardCheck /> },
  { title: 'Teams', url: routeNames.teams(), icon: <UserRound /> },
  { title: 'Users', url: routeNames.users(), icon: <BookUser /> },
  { title: 'Roles', url: routeNames.roles(), icon: <ShieldUser /> },
  { title: 'Contact', url: routeNames.contact(), icon: <Contact /> },
];

export const AppSidebar = () => {
  const { setOpen } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Sidebar variant="inset" className="top-14 h-[calc(100vh-3.5rem)]">
      <SidebarHeader>
        <SidebarButton />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-2 p-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink
                to={item.url}
                children={({ isActive }) => (
                  <SidebarMenuButton
                    data-active={isActive}
                    className="border-primary/50 data-[active=true]:bg-primary data-[active=true]:text-secondary data-[active=true]:hover:text-secondary/80 cursor-pointer rounded-xl border-1 px-3 py-4"
                  >
                    <span className="inline-flex items-center gap-2 text-xl">
                      {item.icon}
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                )}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
