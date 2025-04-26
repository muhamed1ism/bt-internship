import {
  BookUser, ClipboardCheck, Contact, Home, Layers, ShieldUser, UserRound, UserRoundSearch
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar
} from '../../ui/sidebar';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { SidebarButton } from './SidebarButton';

const items = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'People', url: '/people', icon: UserRoundSearch },
  { title: 'Buckets', url: '/buckets', icon: Layers },
  { title: 'Evaluation', url: '/evaluation', icon: ClipboardCheck },
  { title: 'Teams', url: '/teams', icon: UserRound },
  { title: 'Users', url: '/users', icon: BookUser },
  { title: 'Roles', url: '/roles', icon: ShieldUser },
  { title: 'Contact', url: '/contact', icon: Contact },
]

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Sidebar variant="inset" className="top-14 h-[calc(100vh-3.5rem)]">
      <SidebarHeader>
        <SidebarButton />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2 gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink
                to={item.url}
                children={({ isActive }) => (
                  <SidebarMenuButton
                    data-active={isActive}
                    className="border-1 border-primary/50 rounded-xl cursor-pointer
                    data-[active=true]:bg-primary data-[active=true]:text-secondary px-3 py-4
                    data-[active=true]:hover:text-secondary/80"
                  >
                    <span className="text-xl inline-flex items-center gap-2">
                      <item.icon />
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                )} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
