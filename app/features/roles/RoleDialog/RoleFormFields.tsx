// RoleFormFields.tsx
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';
import { PermissionTabs } from '../RolesTable/PermissionTabs';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

export type RoleFormFieldsProps = {
  register: UseFormRegister<{ roleName: string }>;
  errors: FieldErrors<{ roleName: string }>;
  selectedPermissions: { [category: string]: string[] };
  setSelectedPermissions: (p: { [category: string]: string[] }) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function RoleFormFields({
  register,
  errors,
  selectedPermissions,
  setSelectedPermissions,
  activeTab,
  setActiveTab,
}: RoleFormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="roleName">Role Name:</Label>
        <Input
          id="roleName"
          {...register('roleName')}
          className="w-full"
          placeholder="Enter role name"
        />
        {errors.roleName && <p className="text-sm text-red-500">{errors.roleName.message}</p>}
      </div>

      <Separator className="my-4" />

      <PermissionTabs
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
