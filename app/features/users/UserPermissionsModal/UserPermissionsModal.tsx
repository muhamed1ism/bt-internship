import { UserType } from '@app/types/types';

export interface UserPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
  onSave: (user: UserType) => void;
}

function UserPermissionsModal({ open, onOpenChange, user, onSave }: UserPermissionsModalProps) {
  return <div>UserPermissionsModal</div>;
}

export default UserPermissionsModal;
