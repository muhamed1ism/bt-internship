import { Button } from '@app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import { UserType } from '@app/types/types';
import { ColumnDef } from '@tanstack/react-table';
import { Code, MoreVertical, Shield, User } from 'lucide-react';

export const ActionColumn: ColumnDef<UserType> = {
  id: 'action',
  header: 'Actions',
  cell: ({ row }) => {
    const user = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
          // onClick={onOpenPersonal}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Personal Info</span>
          </DropdownMenuItem>
          <DropdownMenuItem
          // onClick={onOpenSkills}
          >
            <Code className="mr-2 h-4 w-4" />
            <span>Skills</span>
          </DropdownMenuItem>
          <DropdownMenuItem
          // onClick={onOpenRoles}
          >
            <Shield className="mr-2 h-4 w-4" />
            <span>Roles</span>
          </DropdownMenuItem>{' '}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
