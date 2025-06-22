import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface TeamRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teamName: string;
}

export const TeamRemovalModal = ({
  isOpen,
  onClose,
  onConfirm,
  teamName,
}: TeamRemovalModalProps) => {
  const [confirmationName, setConfirmationName] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (confirmationName !== teamName) return;

    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
      setConfirmationName('');
    }
  };

  const handleClose = () => {
    setConfirmationName('');
    onClose();
  };

  const isValid = confirmationName === teamName;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">Remove Team</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              This will permanently remove <strong>{teamName}</strong> and all associated data. All
              team members will need to be reassigned to other teams.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation-name" className="text-sm font-medium text-gray-700">
              To confirm, type <strong>{teamName}</strong> below:
            </Label>
            <Input
              id="confirmation-name"
              type="text"
              value={confirmationName}
              onChange={(e) => setConfirmationName(e.target.value)}
              placeholder={`Type "${teamName}" to confirm`}
              className="w-full"
              autoComplete="off"
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isConfirming}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={!isValid || isConfirming}
              className="min-w-[100px]"
            >
              {isConfirming ? 'Removing...' : 'Remove Team'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
