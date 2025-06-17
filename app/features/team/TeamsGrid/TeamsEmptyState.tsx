import { Search } from 'lucide-react';

export const TeamsEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <Search className="text-muted-foreground/50 mx-auto h-12 w-12" />
        <h3 className="text-foreground mt-4 text-lg font-medium">No teams found</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Try adjusting your search criteria or create a new team.
        </p>
      </div>
    </div>
  );
};
