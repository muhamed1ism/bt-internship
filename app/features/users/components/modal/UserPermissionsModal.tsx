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
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Separator } from '../../../../components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog';
import { RoleType, User } from '../../../../types/types';

import { useUserPermissions } from '../useUserPermissions';
import { UserPermissionsFormType } from '../../schemas/userPermissionsSchema';
import { CustomPermissionsSection } from '../CustomPermissionsSection';
import { PermissionEditorDialog } from '../../../roles/components/dialog/PermissionEditorDialog';
import { hasModifiedPermissions } from '../../../roles/utils/roleUtils';

export interface UserPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (user: User) => void;
}

export function UserPermissionsModal({
  open,
  onOpenChange,
  user,
  onSave,
}: UserPermissionsModalProps) {
  const [permissionEditorOpen, setPermissionEditorOpen] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  const {
    handleSubmit,
    watch,
    setValue,
    selectedPermissions,
    setSelectedPermissions,
    activeTab,
    setActiveTab,
    getBaseRolePermissions,
  } = useUserPermissions(user);

  const { assignedRoles, customRoleName } = watch();

  const openPermissionEditor = () => {
    // Initialize selected permissions with base role permissions
    const basePermissions = getBaseRolePermissions(assignedRoles);
    setSelectedPermissions(basePermissions);
    setPermissionEditorOpen(true);
  };

  const onSubmit = (data: UserPermissionsFormType) => {
    // Check if we have modified permissions
    const basePermissions = getBaseRolePermissions(data.assignedRoles);
    const permissionsModified = hasModifiedPermissions(basePermissions, selectedPermissions);

    if (permissionsModified) {
      // Show prompt for custom role name
      setShowNamePrompt(true);
    } else {
      // Just update the user's role
      if (user) {
        const updatedUser = {
          ...user,
          role: data.assignedRoles[0] || '',
          customRole: undefined,
        };
        onSave(updatedUser);
        onOpenChange(false);
      }
    }
  };

  const createCustomRole = () => {
    if (!user) return;

    // Create a custom role with the selected permissions
    const customRole: RoleType = {
      id: `custom-${user.id}-${Date.now()}`,
      name: customRoleName || `${user.firstName}'s Custom Role`,
      permissions: selectedPermissions,
    };

    const updatedUser = {
      ...user,
      role: 'Custom',
      customRole,
    };

    onSave(updatedUser);
    setShowNamePrompt(false);
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-[500px]">
          {/* HEADER */}
          <div className="bg-primary p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-white">
                User Roles & Permissions
              </DialogTitle>
              <DialogDescription className="text-blue-100">
                Manage user access levels and custom permissions
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* BODY */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6 p-6">
              <RoleAssignmentForm
                assignedRoles={assignedRoles}
                onRolesChange={(roles) => setValue('assignedRoles', roles)}
              />

              <Separator />

              <CustomPermissionsSection
                user={user}
                assignedRoles={assignedRoles}
                onEditPermissions={openPermissionEditor}
              />
            </div>

            {/* FOOTER */}
            <DialogFooter className="bg-muted/20 flex justify-end space-x-2 border-t p-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Permission Editor Modal - Using shared PermissionEditorDialog */}
      <PermissionEditorDialog
        open={permissionEditorOpen}
        onOpenChange={setPermissionEditorOpen}
        title="Edit Role Permissions"
        description={`Customize permissions for ${user.firstName} ${user.lastName}`}
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSave={() => {
          setPermissionEditorOpen(false);
          setShowNamePrompt(true);
        }}
        onCancel={() => setPermissionEditorOpen(false)}
        saveButtonText="Apply Permissions"
      />

      {/* Custom Role Name Prompt */}
      <AlertDialog open={showNamePrompt} onOpenChange={setShowNamePrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Custom Role</AlertDialogTitle>
            <AlertDialogDescription>
              You've modified the permissions. This will create a custom role for this user.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Label htmlFor="customRoleName">Custom Role Name:</Label>
            <Input
              id="customRoleName"
              value={customRoleName || ''}
              onChange={(e) => setValue('customRoleName', e.target.value)}
              className="mt-2"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={createCustomRole} className="bg-primary text-white">
              Create Custom Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
