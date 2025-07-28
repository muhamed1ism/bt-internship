import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { CategorizedPermissions } from '@app/types/shared';
import { Button } from '@app/components/ui/button';
import { useCreateRole } from '@app/hooks/role/useCreateRole';
import { CreateRoleFormValues, roleSchema } from '@app/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@app/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormInputField } from '@app/components/forms/FormInputField';
import { Textarea } from '@app/components/ui/textarea';
import { Separator } from '@app/components/ui/separator';
import { Checkbox } from '@app/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { Spinner } from '@app/components/ui/spinner';
import { splitToWords } from '@app/utils/splitToWords';

export type CreateRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categorizedPermissions: CategorizedPermissions | undefined;
};

export function CreateRoleDialog({
  open,
  onOpenChange,
  categorizedPermissions,
}: CreateRoleDialogProps) {
  const { mutate } = useCreateRole();

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(roleSchema.create),
    defaultValues: {
      name: '',
      description: '',
      permissionIds: [],
    },
  });

  const { control, watch, setValue } = form;
  const selectedIds = watch('permissionIds');

  const handleTogglePermission = (id: string) => {
    const updated = selectedIds?.includes(id)
      ? selectedIds.filter((pid) => pid !== id)
      : [...(selectedIds || []), id];

    setValue('permissionIds', updated, { shouldValidate: true });
  };

  const onSubmit = (formData: CreateRoleFormValues) => {
    mutate(formData);
    onOpenChange(false);
  };

  if (!categorizedPermissions || Object.keys(categorizedPermissions).length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="text flex h-full max-h-[500px] w-full max-w-[900px] items-center justify-center text-xl">
          <Spinner size="large" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-primary/50 max-h-[90vh] overflow-auto p-0 sm:max-w-[900px]">
          <DialogHeader className="bg-primary p-6">
            <DialogTitle className="text-2xl font-semibold text-white">New Role</DialogTitle>
            <DialogDescription className="text-neutral-100">
              Create a new role and assign permissions
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 p-6">
                <FormInputField control={control} name="name" label="Name" />

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bucket Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the role..."
                          className="bg-card border-primary/30 min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-4" />

                <FormLabel>Permissions</FormLabel>
                <Tabs defaultValue={Object.keys(categorizedPermissions)[0]} className="w-full">
                  <TabsList className="bg-muted mb-4 grid h-full w-full grid-cols-3 rounded-md md:grid-cols-6">
                    {Object.keys(categorizedPermissions).map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="text-xs capitalize md:text-sm"
                      >
                        {splitToWords(category)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(categorizedPermissions).map(([category, permissions]) => (
                    <TabsContent key={category} value={category} className="mx-2 mt-4 space-y-4">
                      {permissions?.map((permission) => (
                        <div key={permission.id} className="grid grid-cols-2 gap-2">
                          <label htmlFor={permission.id} className="text-sm capitalize">
                            {permission.action}{' '}
                            {permission.reason ? '- ' + splitToWords(permission.reason) : ''}
                          </label>

                          <Checkbox
                            className="border-primary/30 border-1"
                            id={permission.id}
                            checked={selectedIds?.includes(permission.id)}
                            onCheckedChange={() => handleTogglePermission(permission.id)}
                          />
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <DialogFooter className="border-t-1 p-4">
                <Button
                  variant="outline"
                  className="border-primary/30"
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
