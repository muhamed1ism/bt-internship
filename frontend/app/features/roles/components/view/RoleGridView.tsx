import { Card, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { PenSquare } from 'lucide-react';
import { ViewProps } from '../RolesTable';

function splitToWords(str: string): string {
  let result = str.replace(/[_-]/g, ' ');

  result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

  return result
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function RoleGridView({ roles, onEdit }: ViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <Card key={role.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{splitToWords(role.name)}</h3>
              <Button variant="ghost" size="icon" onClick={() => onEdit(role)} className="h-8 w-8">
                <PenSquare className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </div>
            <div className="text-muted-foreground mt-2 text-sm">
              {Object.keys(role.permissions).length} permission groups
            </div>
          </CardContent>
        </Card>
      ))}
      {roles.length === 0 && (
        <div className="text-muted-foreground col-span-full flex h-24 items-center justify-center">
          No roles found.
        </div>
      )}
    </div>
  );
}
