import { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Label } from '@app/components/ui/label';
import { Badge } from '@app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Plus, X } from 'lucide-react';
import { roles } from '../fake-data';

interface RoleAssignmentFormProps {
  assignedRoles: string[];
  onRolesChange: (roles: string[]) => void;
}

export const RoleAssignmentForm = ({ assignedRoles, onRolesChange }: RoleAssignmentFormProps) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  const addRole = () => {
    if (
      selectedRoleId &&
      !assignedRoles.includes(roles.find((r) => r.id === selectedRoleId)?.name || '')
    ) {
      const role = roles.find((r) => r.id === selectedRoleId);
      if (role) {
        onRolesChange([...assignedRoles, role.name]);
        setSelectedRoleId('');
      }
    }
  };

  const removeRole = (roleName: string) => {
    onRolesChange(assignedRoles.filter((r) => r !== roleName));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Assigned Roles</h3>
        <div className="flex space-x-2">
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={addRole}
            disabled={!selectedRoleId}
            size="sm"
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      <div className="min-h-[50px] rounded-md border p-4">
        {assignedRoles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {assignedRoles.map((role) => (
              <Badge
                key={role}
                className="flex items-center gap-1 bg-blue-100 px-3 py-1 text-blue-800"
              >
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(role)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground flex items-center justify-center text-sm">
            No roles assigned
          </div>
        )}
      </div>
    </div>
  );
};
