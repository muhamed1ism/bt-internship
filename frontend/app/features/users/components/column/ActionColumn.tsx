import { Button } from '@app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import { UserModalType, User as UserType } from '@app/types/types';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, Code, MoreVertical, Shield, User, XCircle } from 'lucide-react';
import { useState } from 'react';
import { PersonalInfoModal } from '../modal/PersonalInfoModal';
import { BucketsModal } from '../modal/BucketsModal';
import { UserPermissionsModal } from '../modal/UserPermissionsModal';
import { useActivateUser, useDectivateUser } from '@app/hooks/user';

export const ActionColumn: ColumnDef<UserType> = {
  id: 'action',
  header: 'Actions',
  cell: ({ row }) => {
    const user = row.original;

    const { mutate: activateUser } = useActivateUser();
    const { mutate: deactivateUser } = useDectivateUser();

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
          <Button variant="ghost" size="icon" className="size-8">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOpenModal('personal', user)}>
            <User className="mr-2 size-4" />
            <span>Personal Info</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenModal('buckets', user)}>
            <Code className="mr-2 size-4" />
            <span>Buckets</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenModal('roles', user)}>
            <Shield className="mr-2 size-4" />
            <span>Roles</span>
          </DropdownMenuItem>

          {user.status === 'ACTIVE' ? (
            <DropdownMenuItem onClick={() => deactivateUser(user.id)}>
              <XCircle className="mr-2 size-4" />
              <span>Deactivate</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => activateUser(user.id)}>
              <CheckCircle className="mr-2 size-4" />
              <span>Activate</span>
            </DropdownMenuItem>
          )}
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
