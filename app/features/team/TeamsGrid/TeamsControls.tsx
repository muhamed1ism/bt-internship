import { Input } from '@app/components/ui/input';
import { Button } from '@app/components/ui/button';
import { Search, Grid3x3, List, Plus } from 'lucide-react';
import { ViewMode } from '@app/types/team';

interface TeamsControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateTeam?: () => void;
}

export const TeamsControls = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onCreateTeam,
}: TeamsControlsProps) => {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Bar */}
      <div className="relative max-w-md flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search teams or team leads..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Create Team Button and View Mode Toggle */}
      <div className="flex items-center gap-2">
        {onCreateTeam && (
          <Button onClick={onCreateTeam} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Team
          </Button>
        )}

        <div className="ml-2 flex items-center gap-2 border-l pl-2">
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
