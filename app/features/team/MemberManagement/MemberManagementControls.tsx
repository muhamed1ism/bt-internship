import { Input } from '@app/components/ui/input';
import { Button } from '@app/components/ui/button';
import { Search, Grid3x3, List, Plus, LayoutGrid } from 'lucide-react';
import { ViewMode } from '@app/types/member-management';

interface MemberManagementControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  memberCount: number;
}

export const MemberManagementControls = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  memberCount,
}: MemberManagementControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Search and Add Member */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative w-full flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-primary-foreground h-[36px] pl-10"
          />
        </div>

        {/* View Mode Toggle and Member Count */}
        <div className="flex items-center justify-between">
          <div className="flex rounded-lg border-1">
            <Button
              size="icon"
              onClick={() => onViewModeChange('list')}
              className={`rounded-r-none ${viewMode === 'list' ? 'text-primary-foreground bg-primary' : 'text-primary bg-primary-foreground hover:bg-primary/10'}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={() => onViewModeChange('grid')}
              className={`rounded-l-none ${viewMode === 'grid' ? 'text-primary-foreground bg-primary' : 'text-primary bg-primary-foreground hover:bg-primary/10'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        {memberCount} member{memberCount !== 1 ? 's' : ''}
      </p>
    </div>
  );
};
