import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@app/components/ui/dialog';
import { TeamForm } from '../form/TeamForm';
import { Team } from '@app/types/team';

export interface TeamFormProps {
  team?: Team;
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export const TeamFormModal = (formData: TeamFormProps) => {
  return (
    <Dialog open={formData.isOpen} onOpenChange={(open) => !open && formData.onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {formData.mode === 'create'
              ? 'Create New Team'
              : `Edit ${formData.team?.name || 'Team'}`}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <TeamForm {...formData} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
