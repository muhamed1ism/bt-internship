import { Button } from '../../ui/button';
import { useSidebar } from '../../ui/sidebar';
import { Menu } from 'lucide-react';

export const SidebarButton = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={toggleSidebar}
      className="text-primary hover:text-primary/80 min-md:hidden py-6 w-12 cursor-pointer"
    >
      <Menu className="size-8" />
    </Button>
  );
}
