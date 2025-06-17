import { Search, Plus } from 'lucide-react';
import { Button } from '@app/components/ui/button';

interface TeamsEmptyStateProps {
  onCreateTeam?: () => void;
}

export const TeamsEmptyState = ({ onCreateTeam }: TeamsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <Search className="text-muted-foreground/50 mx-auto h-12 w-12" />
        <h3 className="text-foreground mt-4 text-lg font-medium">No teams found</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Try adjusting your search criteria or create a new team.
        </p>

        {onCreateTeam && (
          <Button onClick={onCreateTeam} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        )}
      </div>
    </div>
  );
};
