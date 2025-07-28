import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { TableColumnHeader } from './TableColumnHeader';

export const createColumn = <T extends object>(
  key: keyof T,
  headerName: string,
  customCell?: (row: T) => React.ReactNode,
): ColumnDef<T, any> => ({
  accessorKey: key as string,
  header: ({ column }) => <TableColumnHeader column={column} title={headerName} />,
  cell: customCell
    ? ({ row }) => customCell(row.original)
    : ({ row }) => {
        const value = row.original[key] as React.ReactNode;

        if (key === 'action') {
          const actions = value as { label: string; callback: () => void }[];
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-2">
                {actions?.map((action, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    onClick={action.callback}
                    className="h-auto py-1 text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        if (key === 'image') {
          return (
            <img
              src={typeof value === 'string' ? value : ''}
              alt={
                typeof row.original === 'object' &&
                'title' in row.original &&
                typeof row.original.title === 'string'
                  ? row.original.title
                  : 'Image'
              }
              className="h-16 w-16 rounded-md object-cover"
            />
          );
        }

        return <div>{value}</div>;
      },
});
