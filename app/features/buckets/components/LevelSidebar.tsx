import { Plus } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Card, CardContent } from '@app/components/ui/card';
import type { Level } from '@app/types/bucket';
import { STATUS_ICONS, DIFFICULTY_COLORS } from '@app/constants/bucket';
import { getStatusClasses, formatLevelTitle } from '@app/utils/bucket';

interface LevelSidebarProps {
  levels: Level[];
  selectedLevel: Level | null;
  onLevelSelect: (level: Level) => void;
  onCreateLevel: () => void;
  showCreateButton?: boolean;
}

export const LevelSidebar = ({
  levels,
  selectedLevel,
  onLevelSelect,
  onCreateLevel,
  showCreateButton = true,
}: LevelSidebarProps) => {
  const renderIcon = (status: Level['status']) => {
    const IconComponent = STATUS_ICONS[status];
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-6">
        {showCreateButton && (
          <Button
            onClick={onCreateLevel}
            className="mb-6 w-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Level
          </Button>
        )}

        <div className="space-y-3">
          {levels.map((level, index) => (
            <div key={level.id} className="relative">
              {/* Connection line */}
              {index > 0 && <div className="bg-border absolute -top-3 left-6 h-3 w-0.5"></div>}

              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedLevel?.id === level.id
                    ? 'ring-primary bg-primary/5 ring-2'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => onLevelSelect(level)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${getStatusClasses(level.status)}`}>
                      {renderIcon(level.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{formatLevelTitle(level)}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${DIFFICULTY_COLORS[level.difficulty]}`}
                        >
                          {level.difficulty}
                        </Badge>
                        <span className="text-muted-foreground text-xs">{level.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
