import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { Textarea } from '@app/components/ui/textarea';
import { Label } from '@app/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { useCreateReport } from '@app/hooks/report';
import { TeamMember } from '@app/types/team';
import { CreateReportFormValues } from '@app/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportSchema } from '@app/schemas/reportSchemas';
import { Spinner } from '@app/components/ui/spinner';
import { toast } from 'sonner';
import { useAuth } from '@app/context/AuthContext';
import { Alert, AlertDescription } from '@app/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export const ReportModal = ({ isOpen, onClose, member }: ReportModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: createReport } = useCreateReport();
  const { user: currentUser } = useAuth();

  // Check if current user is trying to report about themselves
  const isSelfReporting = currentUser && member && currentUser.id === member.user.id;

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

  const getPositionBadgeClass = (position: string) => {
    switch (position.toLowerCase()) {
      case 'team lead':
        return 'bg-purple-100 text-purple-800';
      case 'tech lead':
        return 'bg-blue-100 text-blue-800';
      case 'frontend developer':
        return 'bg-green-100 text-green-800';
      case 'backend developer':
        return 'bg-orange-100 text-orange-800';
      case 'project manager':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const onSubmit = (data: CreateReportFormValues) => {
    if (!member) return;

    setIsSubmitting(true);
    
    createReport(
      { formData: data, userId: member.user.id },
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
      }
    );
  };

  const handleClose = () => {
    reset();
    setIsSubmitting(false);
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="text-primary-foreground bg-neutral-800 text-sm font-semibold">
                {getInitials(member.user.firstName, member.user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">
                Submit Report for {member.user.firstName} {member.user.lastName}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`${getPositionBadgeClass(member.position)} border-primary/30 text-xs`}
                >
                  {member.position}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`${
                    member.user.status.toLowerCase() === 'active'
                      ? 'bg-blue-400 text-white'
                      : member.user.status.toLowerCase() === 'inactive'
                        ? 'bg-red-400 text-white'
                        : 'bg-yellow-400 text-black'
                  } text-xs`}
                >
                  {member.user.status}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Provide a detailed report about this team member's performance, contributions, and areas for improvement.
          </DialogDescription>
        </DialogHeader>

        {isSelfReporting && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You cannot write a report about yourself. Please select a different team member.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Report Content</Label>
            <Textarea
              id="content"
              placeholder="Describe the team member's performance, achievements, challenges, and recommendations..."
              className="min-h-[200px] resize-none"
              {...register('content')}
              disabled={isSelfReporting || false}
            />
            {errors.content && (
              <p className="text-destructive text-sm">{errors.content.message}</p>
            )}
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