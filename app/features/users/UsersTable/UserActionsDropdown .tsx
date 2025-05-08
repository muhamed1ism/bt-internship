import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

import { Button } from '../../../components/ui/button';

import { MoreVertical, User, Code, Shield } from 'lucide-react';

type UserActionsDropdownProps = {
  onOpenPersonal: () => void;
  onOpenSkills: () => void;
  onOpenRoles: () => void;
};

export function UserActionsDropdown({
  onOpenPersonal,
  onOpenSkills,
  onOpenRoles,
}: UserActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onOpenPersonal}>
          <User className="mr-2 h-4 w-4" />
          <span>Personal Info</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenSkills}>
          <Code className="mr-2 h-4 w-4" />
          <span>Skills</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenRoles}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Roles</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserActionsDropdown;
