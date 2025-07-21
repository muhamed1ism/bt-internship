import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { User } from '@app/types/types';
import { BucketsForm } from '../form/BucketsForm';
import { useGetCategories } from '@app/hooks/bucket';

type BucketsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export function BucketsModal({ open, onOpenChange, user }: BucketsModalProps) {
  const { categories: buckets } = useGetCategories();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[700px]">
        <div className="bg-primary p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-white">
              Skills & Expertise
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Manage user skills, interests, and professional buckets
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="w-full p-6">
          <BucketsForm user={user} buckets={buckets || []} />
        </div>

        <div className="bg-muted/20 flex items-center justify-end gap-2 border-t p-6">
          <Button
            variant="outline"
            className="border-primary/30"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
