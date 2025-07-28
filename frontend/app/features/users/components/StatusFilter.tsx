import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';

interface Props {
  statusFilter: string;
  onStatusFilter: (status: string) => void;
}

export const StatusFilter = ({ statusFilter, onStatusFilter }: Props) => {
  return (
    <Select value={statusFilter} onValueChange={onStatusFilter}>
      <SelectTrigger className="bg-card w-full md:w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
      </SelectContent>
    </Select>
  );
};
