import { ArrowLeft, Edit2, ChevronRight, Award, Target, Clock } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Separator } from '@app/components/ui/separator';
import { AbilityContext, Can } from '@app/casl/AbilityContext';
import { useAbility } from '@casl/react';

interface BucketHeaderProps {
  title: string;
  description?: string;
  totalLevels?: number;
  onNavigateBack: () => void;
  breadcrumb?: string;
  onOpenUpdateBucket?: () => void;
  isEditingLevel?: boolean;
  isCreatingLevel?: boolean;
}

export const BucketHeader = ({
  title,
  description,
  totalLevels,
  onNavigateBack,
  breadcrumb = 'Buckets',
  onOpenUpdateBucket,
  isEditingLevel = false,
  isCreatingLevel = false,
}: BucketHeaderProps) => {
  const ability = useAbility(AbilityContext);

  return (
    <div className="bg-card border-b shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onNavigateBack} className="hover:bg-accent">
            <ArrowLeft className="size-5" />
          </Button>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>{breadcrumb}</span>
            {title && (
              <>
                <ChevronRight className="size-4" />
                <span className="text-foreground font-medium">{title}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {title && (
        <div className="px-6 pb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Award className="text-primary size-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground mt-1">{description}</p>
              </div>
            </div>
            <Can I="update" a="BucketCategory" ability={ability}>
              {!isEditingLevel && !isCreatingLevel && (
                <Button variant="ghost" size="icon" className="size-8" onClick={onOpenUpdateBucket}>
                  <Edit2 className="size-4" />
                </Button>
              )}
            </Can>
          </div>

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Target className="size-4" />
              <span>{totalLevels} Levels</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>Progressive Development Path</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
