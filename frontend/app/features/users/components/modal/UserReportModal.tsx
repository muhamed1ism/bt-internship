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
import { Textarea } from '@app/components/ui/textarea';
import { Label } from '@app/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { useCreateReport } from '@app/hooks/report';
import { User } from '@app/types/types';
import { CreateReportFormValues } from '@app/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportSchema } from '@app/schemas/reportSchemas';
import { Spinner } from '@app/components/ui/spinner';
import { toast } from 'sonner';
import { useAuth } from '@app/context/AuthContext';
import { Alert, AlertDescription } from '@app/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface UserReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserReportModal = ({ isOpen, onClose, user }: UserReportModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: createReport } = useCreateReport();
  const { user: currentUser } = useAuth();

  // Check if current user is trying to report about themselves
  const isSelfReporting = currentUser && user && currentUser.id === user.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateReportFormValues>({
    resolver: zodResolver(reportSchema.create),
    mode: 'onChange',
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-blue-400 text-white';
      case 'inactive':
        return 'bg-red-400 text-white';
      case 'pending':
        return 'bg-yellow-400 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const onSubmit = (data: CreateReportFormValues) => {
    if (!user) return;

    setIsSubmitting(true);

    createReport(
      { formData: data, userId: user.id },
      {
        onSuccess: () => {
          toast.success('Report submitted successfully');
          handleClose();
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to submit report');
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  const handleClose = () => {
    reset();
    setIsSubmitting(false);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="text-primary-foreground bg-neutral-800 text-sm font-semibold">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">
                Submit Report for {user.firstName} {user.lastName}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`${getStatusBadgeClass(user.status)} text-xs`}
                >
                  {user.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {user.role.name}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Provide a detailed report about this user's performance, contributions, and areas for
            improvement.
          </DialogDescription>
        </DialogHeader>

        {isSelfReporting && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You cannot write a report about yourself. Please select a different user.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Report Content</Label>
            <Textarea
              id="content"
              placeholder="Describe the user's performance, achievements, challenges, and recommendations..."
              className="min-h-[200px] resize-none"
              {...register('content')}
              disabled={isSelfReporting || false}
            />
            {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting || isSelfReporting || false}>
              {isSubmitting ? (
                <>
                  <Spinner size="small" className="mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

