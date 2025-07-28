import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Column } from '@tanstack/react-table';

type Props<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
};

export function TableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: Props<TData, TValue>) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
