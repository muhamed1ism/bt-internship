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
import { useNavigate } from 'react-router-dom';
import routeNames from '@app/routes/route-names';

export const UserMenu = () => {
  const { user } = useAuth();
  const { mutate } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    mutate();
  };

  const handleProfileClick = () => {
    navigate(routeNames.profile());
  };

  const menuItems = [
    {
      icon: <UserRound />,
      label: 'Profile',
      onClick: handleProfileClick,
    },
    {
      icon: <Settings />,
      label: 'Settings',
      onClick: undefined,
    },
  ];

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

      <DropdownMenuContent className="mt-2 mr-1 w-56 rounded-xl p-2">
        <div className="mb-3 flex flex-col px-1">
          <p className="w-full text-lg font-semibold">{user?.firstName + ' ' + user?.lastName}</p>
          <p className="text-primary/80 w-full">{user?.email}</p>
        </div>

        <DropdownMenuGroup className="mb-3">
          {menuItems.map((item, idx) => (
            <DropdownMenuItem key={idx} className="mb-1" onClick={item.onClick}>
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <Button onClick={handleLogout} className="text-md w-full font-semibold">
          Log out
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
