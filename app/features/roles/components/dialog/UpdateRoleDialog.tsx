import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { CategorizedPermissions, Role } from '@app/types/shared';
import { Button } from '@app/components/ui/button';
import { roleSchema, UpdateRoleFormValues } from '@app/schemas';
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
import { useUpdateRole } from '@app/hooks/role/useUpdateRole';
import { splitToWords } from '@app/utils/splitToWords';
import { useEffect } from 'react';

export type UpdateRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categorizedPermissions: CategorizedPermissions | undefined;
  role: Role | null;
};

const isDisabled = (roleName: string) => {
  return ['admin', 'team_lead', 'user'].find((name) => name === roleName) ? true : false;
};

export function UpdateRoleDialog({
  open,
  onOpenChange,
  categorizedPermissions,
  role,
}: UpdateRoleDialogProps) {
  const { mutate } = useUpdateRole();

  const form = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(roleSchema.update),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      permissionIds: [],
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name || '',
        description: role.description || '',
        permissionIds: role.permissions?.map((p) => p.id) || [],
      });
    }
  }, [role, form]);

  const { control, watch, setValue } = form;
  const selectedPermissions = form.getValues('permissionIds');
  const selectedIds = watch('permissionIds');

  const handleTogglePermission = (id: string) => {
    const updated = selectedIds?.includes(id)
      ? selectedIds.filter((pid) => pid !== id)
      : [...(selectedIds || []), id];

    setValue('permissionIds', updated, { shouldValidate: true });
  };

  const onSubmit = (formData: UpdateRoleFormValues) => {
    mutate({ formData, roleId: role?.id || '' });
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
            <DialogTitle className="text-2xl font-semibold text-white">Edit Role</DialogTitle>
            <DialogDescription className="text-neutral-100">
              Modify role name and permissions
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 p-6">
                <FormInputField
                  disabled={isDisabled(role?.name || '') || false}
                  control={control}
                  name="name"
                  label="Name"
                />

                <FormField
                  disabled={isDisabled(role?.name || '') || false}
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
                            disabled={isDisabled(role?.name || '') || false}
                            className="bg-card border-primary/30 border-1"
                            id={permission.id}
                            checked={
                              selectedIds?.includes(permission.id) ||
                              selectedPermissions?.includes(permission.id)
                            }
                            onCheckedChange={() => handleTogglePermission(permission.id)}
                          />
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <DialogFooter className="border-t-1 p-4">
                {isDisabled(role?.name || '') ? (
                  <Button
                    variant="outline"
                    type="button"
                    className="border-primary/30"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-primary/30"
                      type="button"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
