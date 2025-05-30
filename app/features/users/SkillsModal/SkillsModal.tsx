import { UserType } from '@app/types/types';

function SkillsModal({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}) {
  return <div>SkillsModal</div>;
}

export default SkillsModal;
