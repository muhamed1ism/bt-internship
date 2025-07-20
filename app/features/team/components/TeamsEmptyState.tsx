import { Search, Plus } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { useAbility } from '@casl/react';
import { AbilityContext, Can } from '@app/casl/AbilityContext';

interface TeamsEmptyStateProps {
  onCreateTeam?: () => void;
  isLoading: boolean;
}

export const TeamsEmptyState = ({ onCreateTeam, isLoading }: TeamsEmptyStateProps) => {
  const ability = useAbility(AbilityContext);

  if (isLoading) {
    return;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <Search className="text-muted-foreground/50 mx-auto h-12 w-12" />
        <h3 className="text-foreground mt-4 text-lg font-medium">No teams found</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Try adjusting your search criteria or create a new team.
        </p>

        <Can I="create" a="team" ability={ability}>
          {onCreateTeam && (
            <Button onClick={onCreateTeam} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          )}
        </Can>
      </div>
    </div>
  );
};
