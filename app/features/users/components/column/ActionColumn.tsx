import { Button } from '@app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import { User as UserType } from '@app/types/types';
import { ColumnDef } from '@tanstack/react-table';
import { Code, MoreVertical, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { PersonalInfoModal } from '../modal/PersonalInfoModal';
import { SkillsModal } from '../modal/SkillsModal';
import { UserPermissionsModal } from '../modal/UserPermissionsModal';

export const ActionColumn: ColumnDef<UserType> = {
  id: 'action',
  header: 'Actions',
  cell: ({ row }) => {
    const user = row.original;

    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [activeModal, setActiveModal] = useState<null | UserModalType>(null);
    const [dropdownOpenUserId, setDropdownOpenUserId] = useState<string | number | null>(null);

    const openModal = (type: UserModalType, user: UserType) => {
      setSelectedUser(user);
      setActiveModal(type);
    };

    const handleOpenModal = (modalType: UserModalType, user: UserType) => {
      openModal(modalType, user);
      setDropdownOpenUserId(null);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOpenModal('personal', user)}>
            <User className="mr-2 h-4 w-4" />
            <span>Personal Info</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenModal('skills', user)}>
            <Code className="mr-2 h-4 w-4" />
            <span>Skills</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenModal('roles', user)}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Roles</span>
          </DropdownMenuItem>{' '}
        </DropdownMenuContent>

        <PersonalInfoModal
          open={activeModal === 'personal'}
          onOpenChange={() => setActiveModal(null)}
          user={user}
        />

        <SkillsModal
          open={activeModal === 'skills'}
          onOpenChange={() => setActiveModal(null)}
          user={selectedUser}
        />

        {/* <UserPermissionsModal */}
        {/*   open={activeModal === 'roles'} */}
        {/*   onOpenChange={() => setActiveModal(null)} */}
        {/*   user={selectedUser} */}
        {/* /> */}
      </DropdownMenu>
    );
  },
};
