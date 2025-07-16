import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Plus } from 'lucide-react';

interface AddMemberCardProps {
  onAddMember: () => void;
  viewMode?: 'grid' | 'list';
}

export const AddMemberCard = ({ onAddMember, viewMode = 'grid' }: AddMemberCardProps) => {
  // List view
  if (viewMode === 'list') {
    return (
      <Card className="bg-primary/10 hover:border-primary/50 inset-shadow-primary/20 border-primary/10 h-36 p-0 shadow-none inset-shadow-xs transition-colors hover:border-2 hover:inset-shadow-2xs">
        <CardContent className="h-full w-full p-0">
          <Button
            onClick={onAddMember}
            variant="ghost"
            className="text-muted-foreground hover:bg-secondary/20 hover:text-primary flex h-full w-full flex-col items-center justify-center gap-4"
          >
            <Plus className="size-10" />
            <span className="text-xl font-medium">Add Member</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="bg-primary/10 hover:border-primary/50 inset-shadow-primary/20 border-primary/10 h-92 p-0 shadow-none inset-shadow-xs transition-colors hover:border-2 hover:inset-shadow-xs">
      <CardContent className="h-full w-full p-0">
        <Button
          onClick={onAddMember}
          variant="ghost"
          className="text-muted-foreground hover:bg-secondary/20 hover:text-primary flex h-full w-full flex-col items-center justify-center gap-4"
        >
          <Plus className="size-10" />
          <span className="text-xl font-medium">Add Member</span>
        </Button>
      </CardContent>
    </Card>
  );
};
