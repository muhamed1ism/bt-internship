import { Badge } from '@app/components/ui/badge';
import { User } from '@app/types/types';
import { ColumnDef } from '@tanstack/react-table';

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-red-100 text-red-800 border-red-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export const StatusColumn: ColumnDef<User> = {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const status = row.original.status?.toLowerCase();
    const className = statusColors[status as keyof typeof statusColors] ?? 'bg-muted';

    return (
      <Badge variant="outline" className={`${className} w-17`}>
        {status?.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  },
};
