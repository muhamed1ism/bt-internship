import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { PermissionTabs } from '../PermissionTabs';

interface PermissionEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  selectedPermissions: { [category: string]: string[] };
  setSelectedPermissions: (permissions: { [category: string]: string[] }) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  loading?: boolean;
}

export function PermissionEditorDialog({
  open,
  onOpenChange,
  title,
  description,
  selectedPermissions,
  setSelectedPermissions,
  activeTab,
  setActiveTab,
  onSave,
  onCancel,
  saveButtonText = 'Apply Permissions',
  cancelButtonText = 'Cancel',
  loading = false,
}: PermissionEditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-medium">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <PermissionTabs
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            {cancelButtonText}
          </Button>
          <Button
            type="button"
            onClick={onSave}
            className="bg-primary text-white"
            disabled={loading}
          >
            {loading ? 'Saving...' : saveButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
