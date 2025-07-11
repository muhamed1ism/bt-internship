import { ArrowLeft, Edit2, Users, ChevronRight, Award, Target, Clock } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Separator } from '@app/components/ui/separator';

interface BucketHeaderProps {
  title: string;
  description?: string;
  totalLevels?: number;
  onNavigateBack: () => void;
  breadcrumb?: string;
}

export const BucketHeader = ({
  title,
  description,
  totalLevels,
  onNavigateBack,
  breadcrumb = 'Buckets',
}: BucketHeaderProps) => {
  return (
    <div className="bg-card border-b shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onNavigateBack} className="hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>{breadcrumb}</span>
            {title && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{title}</span>
              </>
            )}
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-500 px-4 py-2 text-white hover:bg-green-600">
          <Users className="mr-1 h-4 w-4" />
          Admin
        </Badge>
      </div>

      {title && (
        <div className="px-6 pb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Award className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground mt-1">{description}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{totalLevels} Levels</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Progressive Development Path</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
