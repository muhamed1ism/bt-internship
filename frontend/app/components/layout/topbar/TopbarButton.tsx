import { Button } from '../../ui/button';
import { useSidebar } from '../../ui/sidebar';
import { Menu } from 'lucide-react';

export const TopbarButton = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={toggleSidebar}
      className="text-secondary hover:text-secondary/80 hover:bg-primary/0 cursor-pointer min-lg:hidden"
    >
      <Menu className="size-8" />
    </Button>
  );
};
