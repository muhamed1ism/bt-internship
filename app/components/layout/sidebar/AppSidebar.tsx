import {
  BookUser,
  ClipboardCheck,
  Contact,
  FileText,
  Home,
  Layers,
  MessageSquareText,
  ShieldUser,
  Ticket,
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
import { useAbility } from '@casl/react';
import { AbilityContext } from '@app/casl/AbilityContext';

// TODO: Make sidebar items role-based - show different items based on user role
// CTO role: Should see "CTO Tickets"
// Employee role: Should see "Employee Chat"
// Admin role: Should see both
export const AppSidebar = () => {
  const { setOpen } = useSidebar();
  const ability = useAbility(AbilityContext);

  const allItems = [
    { title: 'Dashboard', url: routeNames.dashboard(), icon: <Home /> },
    { title: 'People', url: routeNames.people(), icon: <UserRoundSearch /> },
    { title: 'Buckets', url: routeNames.buckets(), icon: <Layers /> },
    { title: 'Evaluation', url: routeNames.evaluation(), icon: <ClipboardCheck /> },
    { title: 'Teams', url: routeNames.teams(), icon: <UserRound /> },
    { title: 'Users', url: routeNames.users(), icon: <BookUser /> },
    { title: 'Roles', url: routeNames.roles(), icon: <ShieldUser /> },
    { title: 'Reports', url: routeNames.reports(), icon: <FileText /> },
    { title: 'Contact', url: routeNames.contact(), icon: <Contact /> },
    { title: 'CTO Tickets', url: routeNames.ticketCTO(), icon: <Ticket /> },
    { title: 'Employee Tickets', url: routeNames.ticketEmployee(), icon: <MessageSquareText /> },
  ];

  const items = allItems.filter((item) => {
    switch (item.title) {
      case 'People':
        return ability.can('read', 'User');
      case 'Buckets':
        return ability.can('read', 'BucketCategory');
      case 'Evaluation':
        return ability.can('manage', 'UserBucket');
      case 'Teams':
        return ability.can('read', 'Team');
      case 'Users':
        return ability.can('manage', 'User');
      case 'Roles':
        return ability.can('manage', 'Role');
      case 'Reports': {
        return ability.can('read', 'Report');
      }
      case 'CTO Tickets':
        return ability.can('manage', 'Ticket');
      case 'Employee Tickets':
        return ability.can('read', 'Ticket');

      default:
        return true;
    }
  });

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
