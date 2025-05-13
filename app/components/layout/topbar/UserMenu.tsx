import { Button } from '@app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import { useLogout } from '@app/hooks/auth';
import { useAuth } from '@app/context/AuthContext';
import { Settings, UserRound } from 'lucide-react';

export const UserMenu = () => {
  const { user } = useAuth();
  const { mutate } = useLogout();

  const handleLogout = () => {
    mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="hover:bg-secondary/80 ml-0 h-12 w-12 cursor-pointer rounded-full md:ml-2"
        >
          <UserRound className="size-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 mr-1 w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem className="mb-2 flex flex-col gap-0">
            <p className="w-full text-start text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-primary/80 w-full">{user?.email}</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="mx-2">
          <DropdownMenuItem>
            <UserRound />
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="mx-2">
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="mt-2">
          <DropdownMenuItem>
            <Button onClick={handleLogout} className="w-full">
              Log out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
