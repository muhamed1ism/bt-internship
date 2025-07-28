import { CheckCircle2, Clock, Plus, Star } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Card, CardContent } from '@app/components/ui/card';
import type { BucketLevel } from '@app/types/bucket';
import { AbilityContext, Can } from '@app/casl/AbilityContext';
import { useAbility } from '@casl/react';

interface LevelSidebarProps {
  name: string;
  currentLevel: BucketLevel | null;
  levels: BucketLevel[];
  selectedLevel: BucketLevel | null;
  maxLevel: number;
  onLevelSelect: (level: BucketLevel) => void;
  onCreateLevel: () => void;
  showCreateButton?: boolean;
}

export const LevelSidebar = ({
  name,
  levels,
  currentLevel,
  selectedLevel,
  maxLevel,
  onLevelSelect,
  onCreateLevel,
  showCreateButton = true,
}: LevelSidebarProps) => {
  const ability = useAbility(AbilityContext);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-6">
        <Can I="create" a="BucketLevel" ability={ability}>
          {showCreateButton && (
            <Button
              onClick={onCreateLevel}
              className="mb-6 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Level
            </Button>
          )}
        </Can>

        <div className="space-y-5">
          {levels.map((level, index) => (
            <div key={level.id} className="relative">
              {/* Connection line */}
              {index > 0 && (
                <div className="absolute -top-5 left-[50%] h-5 w-[0.2rem] bg-gray-400"></div>
              )}

              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedLevel?.id === level.id && currentLevel?.level
                    ? (selectedLevel.level === currentLevel?.level &&
                        selectedLevel?.level === maxLevel) ||
                      selectedLevel?.level < currentLevel?.level
                      ? 'bg-emerald-50/60 ring-2 ring-emerald-200'
                      : selectedLevel?.level === currentLevel?.level
                        ? 'bg-sky-50/70 ring-2 ring-sky-200'
                        : 'bg-gray-200 ring-2 ring-gray-400'
                    : 'hover:bg-primary-foreground/80'
                }`}
                onClick={() => onLevelSelect(level)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {currentLevel &&
                      (() => {
                        const diff = currentLevel.level - level.level;

                        const config =
                          (currentLevel.level === maxLevel && diff === 0) || diff > 0
                            ? {
                                icon: <CheckCircle2 className="h-4 w-4" />,
                                className: 'bg-emerald-100 text-emerald-600',
                              }
                            : diff === 0
                              ? {
                                  icon: <Clock className="h-4 w-4" />,
                                  className: 'bg-sky-100 text-sky-600',
                                }
                              : {
                                  icon: <Star className="h-4 w-4" />,
                                  className: 'bg-gray-100 text-gray-600',
                                };

                        return (
                          <div className={`rounded-lg p-2 ${config.className}`}>{config.icon}</div>
                        );
                      })()}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {name} {level.level}
                      </p>
                      {/* <div className="mt-1 flex items-center gap-2"> */}
                      {/*   <Badge */}
                      {/*     variant="outline" */}
                      {/*     className={`text-xs ${DIFFICULTY_COLORS[level.difficulty]}`} */}
                      {/*   > */}
                      {/*     {level.difficulty} */}
                      {/*   </Badge> */}
                      {/*   <span className="text-muted-foreground text-xs">{level.estimatedTime}</span> */}
                      {/* </div> */}
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
