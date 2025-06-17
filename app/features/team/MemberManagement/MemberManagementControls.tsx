import { Input } from '@app/components/ui/input';
import { Button } from '@app/components/ui/button';
import { Search, Grid3x3, List, Plus } from 'lucide-react';
import { ViewMode } from '@app/types/member-management';

interface MemberManagementControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddMember: () => void;
  memberCount: number;
}

export const MemberManagementControls = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onAddMember,
  memberCount,
}: MemberManagementControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Search and Add Member */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Add Member Button */}
        <Button
          onClick={onAddMember}
          className="border-yellow-500 bg-yellow-500 text-black hover:border-yellow-600 hover:bg-yellow-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* View Mode Toggle and Member Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>
    </div>
  );
};
