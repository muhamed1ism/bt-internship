// import { useState } from 'react'; // Currently unused
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { PenSquare } from 'lucide-react';
import { User } from '@app/types/types';

interface CustomPermissionsSectionProps {
  user: User;
  assignedRoles: string[];
  onEditPermissions: () => void;
}

export const CustomPermissionsSection = ({
  user,
  assignedRoles,
  onEditPermissions,
}: CustomPermissionsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Custom Permissions</h3>
      </div>

      <div className="bg-muted/10 flex flex-col items-center justify-center space-y-3 rounded-md border p-6">
        <p className="text-muted-foreground text-center text-sm">
          {assignedRoles.length === 0
            ? 'Assign a role first to customize permissions'
            : 'Click the button below to customize permissions for this user'}
        </p>
        <Button
          type="button"
          onClick={onEditPermissions}
          className="px-6 text-white"
          disabled={assignedRoles.length === 0}
          size="lg"
        >
          <PenSquare className="mr-2 h-5 w-5" />
          Edit Permissions
        </Button>
      </div>

      {user.customRole && (
        <div className="bg-muted/20 rounded-md border p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Current Custom Role:</span>
            <Badge className="bg-purple-100 text-purple-800">{user.customRole.name}</Badge>
          </div>
          <div className="text-muted-foreground text-sm">
            This user has a custom role with {Object.keys(user.customRole.permissions).length}{' '}
            permission categories.
          </div>
        </div>
      )}
    </div>
  );
};
