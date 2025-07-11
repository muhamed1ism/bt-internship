import { Input } from '@app/components/ui/input';
import { Button } from '@app/components/ui/button';
import { Search, Grid3x3, List, Plus, LayoutGrid } from 'lucide-react';
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
      <div className="relative w-full flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search teams or team leads..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-primary-foreground h-9 pl-10"
        />
      </div>

      {/* Create Team Button and View Mode Toggle */}
      <div className="ml-auto flex items-center justify-end gap-2">
        <div className="mr-3 flex rounded-lg border-1">
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

        {onCreateTeam && (
          <Button onClick={onCreateTeam} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Team
          </Button>
        )}
      </div>
    </div>
  );
};
