import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Plus } from 'lucide-react';

interface AddMemberCardProps {
  onAddMember: () => void;
  viewMode?: 'grid' | 'list';
}

export const AddMemberCard = ({ onAddMember, viewMode = 'grid' }: AddMemberCardProps) => {
  if (viewMode === 'list') {
    return (
      <Card className="border-muted-foreground/30 hover:border-primary/50 border-2 border-dashed transition-colors">
        <CardContent className="p-4">
          <Button
            onClick={onAddMember}
            variant="ghost"
            className="text-muted-foreground hover:text-primary flex h-full w-full items-center gap-3"
          >
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-lg font-medium">Add Member</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="border-muted-foreground/30 hover:border-primary/50 border-2 border-dashed transition-colors">
      <CardContent className="p-6">
        <Button
          onClick={onAddMember}
          variant="ghost"
          className="text-muted-foreground hover:text-primary flex h-full min-h-[280px] w-full flex-col items-center justify-center gap-4"
        >
          <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
            <Plus className="h-10 w-10" />
          </div>
          <span className="text-lg font-medium">Add Member</span>
        </Button>
      </CardContent>
    </Card>
  );
};
