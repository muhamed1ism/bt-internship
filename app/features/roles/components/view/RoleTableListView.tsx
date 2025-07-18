import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';
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

export function RoleTableListView({ roles, onEdit }: ViewProps) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="bg-card rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80%]">Role</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{splitToWords(role.name)}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(role)}
                  className="h-8 w-8"
                >
                  <PenSquare className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {roles.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                No roles found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
