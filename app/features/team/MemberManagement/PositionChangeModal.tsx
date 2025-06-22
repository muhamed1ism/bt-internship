import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { Label } from '@app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Badge } from '@app/components/ui/badge';
import { Crown } from 'lucide-react';
import { AVAILABLE_POSITIONS } from '@app/constants/member-management';
import type { TeamMemberCard, MemberPosition } from '@app/types/member-management';

interface PositionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMemberCard | null;
  onConfirm: (memberId: string, newPosition: MemberPosition) => void;
}

export const PositionChangeModal = ({
  isOpen,
  onClose,
  member,
  onConfirm,
}: PositionChangeModalProps) => {
  const [selectedPosition, setSelectedPosition] = useState<MemberPosition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setSelectedPosition(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!member || !selectedPosition) return;

    setIsSubmitting(true);
    try {
      await onConfirm(member.id, selectedPosition);
      handleClose();
    } catch (error) {
      console.error('Failed to change position:', error);
      setIsSubmitting(false);
    }
  };

  const getPositionColor = (position: MemberPosition) => {
    if (position.isLead) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (position.title.includes('Tech Lead')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (position.title.includes('Manager')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Position</DialogTitle>
          <DialogDescription>Change the position for {member.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Position */}
          <div>
            <Label className="text-sm font-medium">Current Position</Label>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${getPositionColor(member.position)} flex items-center gap-1`}
              >
                {member.position.isLead && <Crown className="h-3 w-3" />}
                {member.position.title}
              </Badge>
              <span className="text-muted-foreground text-sm">
                {member.position.level} • {member.position.department}
              </span>
            </div>
          </div>

          {/* New Position */}
          <div>
            <Label htmlFor="position" className="text-sm font-medium">
              New Position
            </Label>
            <Select
              value={selectedPosition?.title || ''}
              onValueChange={(value) => {
                const position = AVAILABLE_POSITIONS.find((p) => p.title === value);
                setSelectedPosition(position || null);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a new position" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_POSITIONS.map((position) => (
                  <SelectItem key={position.title} value={position.title}>
                    <div className="flex items-center gap-2">
                      {position.isLead && <Crown className="h-3 w-3" />}
                      <span>{position.title}</span>
                      <span className="text-muted-foreground text-xs">
                        ({position.level} • {position.department})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* New Position Preview */}
          {selectedPosition && (
            <div>
              <Label className="text-sm font-medium">Preview</Label>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`${getPositionColor(selectedPosition)} flex items-center gap-1`}
                >
                  {selectedPosition.isLead && <Crown className="h-3 w-3" />}
                  {selectedPosition.title}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {selectedPosition.level} • {selectedPosition.department}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPosition || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Changing...' : 'Change Position'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
