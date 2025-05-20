import { UserType } from '@app/types/types';

interface PersonalInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}

function PersonalInfoModal({ open, onOpenChange, user }: PersonalInfoModalProps) {
  console.log(open, onOpenChange, user);
  return <div>PersonalInfoModal</div>;
}

export default PersonalInfoModal;
