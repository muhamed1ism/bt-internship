import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { User } from '../../../../types/types';
import { useGetAllRoles } from '@app/hooks/role/useGetAllRoles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { useUpdateUserRole } from '@app/hooks/user';
import { Badge } from '@app/components/ui/badge';
import { Separator } from '@app/components/ui/separator';
import { ScrollArea } from '@app/components/ui/scroll-area';
import { splitToWords } from '@app/utils/splitToWords';

export interface UserPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserPermissionsModal({ open, onOpenChange, user }: UserPermissionsModalProps) {
  const [roleId, setRoleId] = useState('');

  const { mutate } = useUpdateUserRole();
  const { roles } = useGetAllRoles();

  const selectedRole = roleId !== '' ? roles?.find((role) => role.id === roleId) : user?.role;

  const onSave = () => {
    if (!user?.id) {
      console.error('User ID is missing');
      return;
    }

    if (!roleId) {
      console.error('Role ID is missing');
      onOpenChange(false);
      return;
    }

    mutate({ userId: user?.id, roleId });
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-primary/50 overflow-hidden p-0 sm:max-w-3xl">
          {/* HEADER */}
          <div className="bg-primary p-6">
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-semibold text-white">
                User Roles & Permissions
              </DialogTitle>
              <DialogDescription className="text-neutral-100">
                Manage user access levels and custom permissions
              </DialogDescription>
            </DialogHeader>
          </div>

          <ScrollArea className="max-h-96 overflow-y-auto">
            <div className="space-y-2 p-4">
              <h3 className="mx-1 text-lg font-medium">User role: </h3>
              <Select onValueChange={setRoleId} defaultValue={selectedRole?.id}>
                <SelectTrigger className="bg-card border-primary/30 w-34">
                  <SelectValue placeholder={splitToWords(user.role.name)} />
                </SelectTrigger>
                <SelectContent>
                  {roles?.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {splitToWords(role.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <h3 className="mx-1 mt-4 mb-2 text-lg font-medium">Permissions: </h3>
              <div className="bg-accent rounded-xl p-2">
                {selectedRole?.permissions.length !== 0 ? (
                  selectedRole?.permissions.map((permission, index) => (
                    <div key={index} className="px-2">
                      {permission.reason && <p className="text-md">{permission.reason}</p>}

                      <div className="my-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="bg-card border-primary/30 capitalize">
                          {permission.action}
                        </Badge>
                        <Badge className="capitalize">{splitToWords(permission.subject)}</Badge>

                        {permission.fields.length > 0 && (
                          <Badge className="border-blue-300 bg-blue-200 text-blue-700">
                            {'Fields: '}
                            {permission.fields.map((field) => splitToWords(field)).join(', ')}
                          </Badge>
                        )}

                        {/* Only show condition if reason is not defined */}
                        {!permission.reason && permission.conditions && (
                          <Badge variant="secondary">condition</Badge>
                        )}
                      </div>

                      {index < selectedRole.permissions.length - 1 && (
                        <Separator className="bg-primary/30 my-2" />
                      )}
                    </div>
                  ))
                ) : (
                  <h4 className="text-muted-foreground w-full text-center font-medium">
                    Role has no permissions
                  </h4>
                )}
              </div>
            </div>

            {/* BODY */}
            {/* <form onSubmit={handleSubmit(onSubmit)}> */}
            {/* <div className="space-y-6 p-6"> */}
            {/* <RoleAssignmentForm */}
            {/*   assignedRoles={assignedRoles} */}
            {/*   onRolesChange={(roles) => setValue('assignedRoles', roles)} */}
            {/* /> */}
            {/**/}
            {/* <Separator /> */}
            {/**/}
            {/* <CustomPermissionsSection */}
            {/*   user={user} */}
            {/*   assignedRoles={assignedRoles} */}
            {/*   onEditPermissions={openPermissionEditor} */}
            {/* /> */}
            {/* </div> */}
          </ScrollArea>

          {/* FOOTER */}
          <DialogFooter className="bg-muted/20 flex justify-end space-x-2 border-t p-4">
            <Button
              type="button"
              variant="outline"
              className="border-primary/30"
              onClick={() => {
                onOpenChange(false);
                setRoleId('');
              }}
            >
              Cancel
            </Button>
            <Button type="button" className="bg-primary text-white" onClick={onSave}>
              Save Changes
            </Button>
          </DialogFooter>
          {/* </form> */}
        </DialogContent>
      </Dialog>

      {/* Permission Editor Modal - Using shared PermissionEditorDialog */}
      {/* <PermissionEditorDialog */}
      {/*   open={permissionEditorOpen} */}
      {/*   onOpenChange={setPermissionEditorOpen} */}
      {/*   title="Edit Role Permissions" */}
      {/*   description={`Customize permissions for ${user.firstName} ${user.lastName}`} */}
      {/*   selectedPermissions={selectedPermissions} */}
      {/*   setSelectedPermissions={setSelectedPermissions} */}
      {/*   activeTab={activeTab} */}
      {/*   setActiveTab={setActiveTab} */}
      {/*   onSave={() => { */}
      {/*     setPermissionEditorOpen(false); */}
      {/*     setShowNamePrompt(true); */}
      {/*   }} */}
      {/*   onCancel={() => setPermissionEditorOpen(false)} */}
      {/*   saveButtonText="Apply Permissions" */}
      {/* /> */}
      {/**/}
      {/* Custom Role Name Prompt */}

      {/* <AlertDialog open={showNamePrompt} onOpenChange={setShowNamePrompt}> */}
      {/*   <AlertDialogContent> */}
      {/*     <AlertDialogHeader> */}
      {/*       <AlertDialogTitle>Create Custom Role</AlertDialogTitle> */}
      {/*       <AlertDialogDescription> */}
      {/*         You've modified the permissions. This will create a custom role for this user. */}
      {/*       </AlertDialogDescription> */}
      {/*     </AlertDialogHeader> */}
      {/**/}
      {/* <div className="py-4"> */}
      {/*   <Label htmlFor="customRoleName">Custom Role Name:</Label> */}
      {/*   <Input */}
      {/*     id="customRoleName" */}
      {/*     value={customRoleName || ''} */}
      {/*     onChange={(e) => setValue('customRoleName', e.target.value)} */}
      {/*     className="mt-2" */}
      {/*   /> */}
      {/* </div> */}
      {/**/}
      {/*     <AlertDialogFooter> */}
      {/*       <AlertDialogCancel>Cancel</AlertDialogCancel> */}
      {/*       <AlertDialogAction onClick={createCustomRole} className="bg-primary text-white"> */}
      {/*         Create Custom Role */}
      {/*       </AlertDialogAction> */}
      {/*     </AlertDialogFooter> */}
      {/*   </AlertDialogContent> */}
      {/* </AlertDialog> */}
    </>
  );
}
