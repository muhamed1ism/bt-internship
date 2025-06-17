import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@app/components/ui/dialog';
import { TeamFormProps } from '@app/types/team-form';
import { TeamForm } from './TeamForm';

export const TeamFormModal = (props: TeamFormProps) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => !open && props.onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {props.mode === 'create' ? 'Create New Team' : `Edit ${props.team?.name || 'Team'}`}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <TeamForm {...props} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
