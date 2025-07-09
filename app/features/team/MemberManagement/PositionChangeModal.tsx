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
import type { TeamMemberCard, MemberPosition } from '@app/types/member-management';

interface PositionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMemberCard | null;
  onConfirm: (memberId: string, newPosition: MemberPosition) => void;
}

const POSITIONS = [
  'Team Lead',
  'Tech Lead',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Project Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'QA Engineer',
  'Product Manager',
  'Scrum Master',
  'Business Analyst',
];

export const PositionChangeModal = ({
  isOpen,
  onClose,
  member,
  onConfirm,
}: PositionChangeModalProps) => {
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setSelectedPosition('');
    setIsSubmitting(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!member || !selectedPosition) return;

    setIsSubmitting(true);
    try {
      const newPosition: MemberPosition = {
        title: selectedPosition,
        level: 'Mid', // Default level since backend doesn't provide it
        department: 'Engineering', // Default department
        isLead: selectedPosition.toLowerCase().includes('lead'),
      };
      
      await onConfirm(member.id, newPosition);
      handleClose();
    } catch (error) {
      console.error('Failed to change position:', error);
      setIsSubmitting(false);
    }
  };

  const getPositionColor = (position: string) => {
    if (position.toLowerCase().includes('lead')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (position.toLowerCase().includes('manager')) return 'bg-green-100 text-green-800 border-green-200';
    if (position.toLowerCase().includes('developer')) return 'bg-blue-100 text-blue-800 border-blue-200';
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
                className={`${getPositionColor(member.position.title)} flex items-center gap-1`}
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
              value={selectedPosition}
              onValueChange={setSelectedPosition}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a new position" />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((position) => (
                  <SelectItem key={position} value={position}>
                    <div className="flex items-center gap-2">
                      {position.toLowerCase().includes('lead') && <Crown className="h-3 w-3" />}
                      <span>{position}</span>
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
                  {selectedPosition.toLowerCase().includes('lead') && <Crown className="h-3 w-3" />}
                  {selectedPosition}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  Mid • Engineering
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
