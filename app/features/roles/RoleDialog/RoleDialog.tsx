import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { RoleType } from '@app/types/types';
import { RoleFormFields } from './RoleFormFields';
import { RoleSaveOptionsDialog } from './RoleSaveOptionsDialog';
import { useRoleForm, getSchema } from './useRoleForm';

export type RoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleType | null;
  isNew: boolean;
  onSave: (role: RoleType, createNew?: boolean) => void;
  allRoles: RoleType[];
};

export function RoleDialog({ open, onOpenChange, role, isNew, onSave, allRoles }: RoleDialogProps) {
  const currentName = role?.name || '';

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setError,
    trigger,
    formState: { errors },
  } = useRoleForm({ allRoles, currentName });

  const [selectedPermissions, setSelectedPermissions] = useState<{ [category: string]: string[] }>(
    {},
  );
  const [activeTab, setActiveTab] = useState<string>('User Management');
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) {
      reset({ roleName: role.name });
      setSelectedPermissions(role.permissions || {});
      const firstCategory = Object.keys(role.permissions || {})[0] || 'User Management';
      setActiveTab(firstCategory);
    }
  }, [role, reset]);

  const onSubmit = (data: { roleName: string }) => {
    const updatedRole: RoleType = {
      ...role!,
      name: data.roleName,
      permissions: selectedPermissions,
    };

    if (isNew) {
      onSave(updatedRole, true);
      toast.success('New role created successfully');
      onOpenChange(false);
    } else {
      setShowSaveOptions(true);
    }
  };

  const handleSaveOption = async (createNew: boolean) => {
    setLoading(true);
    const formData = getValues();

    if (createNew) {
      const duplicateCheckSchema = getSchema(
        allRoles.map((r) => r.name.toLowerCase()),
        '',
      );
      const result = duplicateCheckSchema.safeParse(formData);
      if (!result.success) {
        setError('roleName', {
          type: 'manual',
          message: result.error.errors[0].message,
        });
        setShowSaveOptions(false);
        setLoading(false);
        return;
      }
    }

    const isValid = await trigger();
    if (!isValid) {
      setLoading(false);
      return;
    }

    const updatedRole: RoleType = {
      ...role!,
      name: formData.roleName,
      permissions: selectedPermissions,
      id: createNew ? `role-${Date.now()}` : role!.id,
    };

    onSave(updatedRole, createNew);
    toast.success(createNew ? 'Role duplicated successfully' : 'Role updated successfully');
    setShowSaveOptions(false);
    onOpenChange(false);
    setLoading(false);
  };

  if (!role) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">
              {isNew ? 'New Role' : `Edit Role: ${role.name}`}
            </DialogTitle>
            <DialogDescription>
              {isNew
                ? 'Create a new role and assign permissions'
                : 'Modify role name and permissions'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <RoleFormFields
              register={register}
              errors={errors}
              selectedPermissions={selectedPermissions}
              setSelectedPermissions={setSelectedPermissions}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Done</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <RoleSaveOptionsDialog
        open={showSaveOptions}
        onOpenChange={setShowSaveOptions}
        onSaveOption={handleSaveOption}
        loading={loading}
      />
    </>
  );
}
