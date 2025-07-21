import { Button } from '@app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import { UserModalType, User as UserType } from '@app/types/types';
import { ColumnDef } from '@tanstack/react-table';
import { Code, MoreVertical, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { PersonalInfoModal } from '../modal/PersonalInfoModal';
import { BucketsModal } from '../modal/BucketsModal';
import { UserPermissionsModal } from '../modal/UserPermissionsModal';

export const ActionColumn: ColumnDef<UserType> = {
  id: 'action',
  header: 'Actions',
  cell: ({ row }) => {
    const user = row.original;

    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [activeModal, setActiveModal] = useState<null | UserModalType>(null);

    const openModal = (type: UserModalType, user: UserType) => {
      setSelectedUser(user);
      setActiveModal(type);
    };

    const handleOpenModal = (modalType: UserModalType, user: UserType) => {
      openModal(modalType, user);
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
          <DropdownMenuItem onClick={() => handleOpenModal('buckets', user)}>
            <Code className="mr-2 h-4 w-4" />
            <span>Buckets</span>
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

        <BucketsModal
          open={activeModal === 'buckets'}
          onOpenChange={() => setActiveModal(null)}
          user={selectedUser}
        />

        <UserPermissionsModal
          open={activeModal === 'roles'}
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
