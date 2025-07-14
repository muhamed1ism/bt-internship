import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { FormInputField } from '@app/components/forms/FormInputField';
import { useForm } from 'react-hook-form';
import { bucketSchema, CreateCategoryFormValues } from '@app/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@app/components/ui/form';
import { Textarea } from '@app/components/ui/textarea';
import { Spinner } from '@app/components/ui/spinner';
import { useCreateCategory } from '@app/hooks/bucket';

interface PositionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBucketDialog = ({ isOpen, onClose }: PositionChangeModalProps) => {
  const { mutate: createCategory, isPending, error } = useCreateCategory();
  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(bucketSchema.createCategory),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleClose = () => {
    onClose();
  };

  const onSubmit = (formData: CreateCategoryFormValues) => {
    createCategory(formData);
    if (!error) handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new bucket</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('Form invalid', errors);
            })}
            className="w-full space-y-4"
          >
            {/* Bucket Name */}
            <FormInputField control={form.control} name="name" label="Name *" />

            {/* Bucket Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bucket Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the bucket category..."
                      className="bg-primary-foreground border-primary/30 min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              {error && <p className="text-sm text-red-500">{error.message}</p>}
              <Button variant="outline" className="border-primary/30" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isPending ? <Spinner className="text-secondary" /> : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
