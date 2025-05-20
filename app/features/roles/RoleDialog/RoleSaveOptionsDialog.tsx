// RoleSaveOptionsDialog.tsx
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { Button } from '../../../components/ui/button';
import { Save, Copy } from 'lucide-react';

export type RoleSaveOptionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveOption: (createNew: boolean) => void;
  loading?: boolean;
};

export function RoleSaveOptionsDialog({
  open,
  onOpenChange,
  onSaveOption,
  loading = false,
}: RoleSaveOptionsDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Changes</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to save changes to the existing role or create a new role with these
            settings?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button
            aria-label="Save to existing role"
            className="flex items-center gap-2"
            onClick={() => onSaveOption(false)}
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            Save to Existing Role
          </Button>
          <Button
            aria-label="Create new role with current settings"
            className="flex items-center gap-2"
            onClick={() => onSaveOption(true)}
            disabled={loading}
          >
            <Copy className="h-4 w-4" />
            Create New Role
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
