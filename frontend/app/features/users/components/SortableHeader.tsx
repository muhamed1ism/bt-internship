import { ChevronUp, ChevronDown } from 'lucide-react';
import { TableHead } from '../../../components/ui/table';
import { User } from '../../../types/types';

type SortableHeaderProps = {
  column: keyof User | any;
  sortKey: keyof User | null;
  direction: 'ascending' | 'descending';
  onSort: (key: keyof User) => void;
  label?: string;
};

export function SortableHeader({ column, sortKey, direction, onSort, label }: SortableHeaderProps) {
  return (
    <TableHead
      className="group cursor-pointer"
      onClick={() => onSort(column)}
      tabIndex={0}
      aria-sort={
        sortKey === column ? (direction === 'ascending' ? 'ascending' : 'descending') : 'none'
      }
    >
      <div className="flex items-center capitalize">
        {label || column}
        {sortKey === column &&
          (direction === 'ascending' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          ))}
      </div>
    </TableHead>
  );
}
