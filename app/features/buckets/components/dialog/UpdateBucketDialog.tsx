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
import { bucketSchema, CreateCategoryFormValues, UpdateCategoryFormValues } from '@app/schemas';
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
import { useUpdateCategory } from '@app/hooks/bucket';
import { BucketCategory } from '@app/types/bucket';

interface UpdateBucketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bucket: BucketCategory;
}

export const UpdateBucketDialog = ({ isOpen, onClose, bucket }: UpdateBucketDialogProps) => {
  const { mutate: updateCategory, isPending, error } = useUpdateCategory();
  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(bucketSchema.createCategory),
    defaultValues: {
      name: bucket.name ?? '',
      description: bucket.description ?? '',
    },
  });

  console.log({ form });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (formData: UpdateCategoryFormValues) => {
    updateCategory({ formData, categoryId: bucket.id });
    if (!error) handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update new bucket</DialogTitle>
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
                      className="bg-card border-primary/30 min-h-[120px]"
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
                {isPending ? <Spinner className="text-secondary" /> : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
