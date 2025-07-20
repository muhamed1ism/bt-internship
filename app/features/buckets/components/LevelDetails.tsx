import { Edit2, TrendingUp, Clock, Sparkles, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@app/components/ui/card';
import { Separator } from '@app/components/ui/separator';
import type { BucketLevel } from '@app/types/bucket';
import { SECTION_ICONS } from '@app/constants/bucket';
import { getSectionBackground } from '@app/utils/bucket';
import { useAbility } from '@casl/react';
import { AbilityContext, Can } from '@app/casl/AbilityContext';

interface LevelDetailsProps {
  name: string;
  level: BucketLevel;
  currentLevel: BucketLevel | null;
  maxLevel: number;
  onEditLevel: (level: BucketLevel) => void;
}

interface SectionProps {
  title: string;
  items: string[];
  sectionType: string;
  className?: string;
}

const Section = ({ title, items, sectionType, className = '' }: SectionProps) => {
  const IconComponent = SECTION_ICONS[sectionType as keyof typeof SECTION_ICONS];
  const backgroundClass = getSectionBackground(sectionType);

  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2">
        {IconComponent && <IconComponent className="h-5 w-5" />}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <Card className={`${backgroundClass} shadow-primary/5 shadow-lg`}>
        <CardContent className="p-4">
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <div
                  className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                    sectionType === 'expectations'
                      ? 'bg-purple-500'
                      : sectionType === 'skills'
                        ? 'bg-blue-500'
                        : sectionType === 'knowledge'
                          ? 'bg-orange-500'
                          : sectionType === 'toAdvance'
                            ? 'bg-emerald-500'
                            : 'bg-primary'
                  }`}
                ></div>
                <span className={sectionType === 'toAdvance' ? 'text-emerald-800' : ''}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export const LevelDetails = ({
  name,
  level,
  currentLevel,
  maxLevel,
  onEditLevel,
}: LevelDetailsProps) => {
  const ability = useAbility(AbilityContext);

  return (
    <div className="lg:col-span-3">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                {currentLevel &&
                  (() => {
                    const diff = currentLevel.level - level.level;

                    const config =
                      diff > 0 || (currentLevel.level === maxLevel && diff === 0)
                        ? {
                            icon: <CheckCircle2 className="h-4 w-4" />,
                            className: 'bg-emerald-100 text-emerald-600',
                          }
                        : diff === 0
                          ? {
                              icon: <Clock className="h-4 w-4" />,
                              className: 'bg-blue-100 text-blue-600',
                            }
                          : {
                              icon: <Star className="h-4 w-4" />,
                              className: 'bg-gray-100 text-gray-600',
                            };

                    return (
                      <div className={`rounded-lg p-2 ${config.className}`}>{config.icon}</div>
                    );
                  })()}
                {name} {level.level}
              </CardTitle>
              {/* <div className="mt-3 flex items-center gap-4"> */}
              {/* <Badge variant="outline" className={DIFFICULTY_COLORS[level.difficulty]}> */}
              {/*   {capitalize(level.difficulty)} */}
              {/* </Badge> */}
              {/* <div className="text-muted-foreground flex items-center gap-1 text-sm"> */}
              {/*   <Clock className="h-4 w-4" /> */}
              {/*   {level.estimatedTime} */}
              {/* </div> */}
              {/* {level.prerequisites && level.prerequisites.length > 0 && ( */}
              {/*   <div className="text-muted-foreground flex items-center gap-1 text-sm"> */}
              {/*     <ChevronRight className="h-4 w-4" /> */}
              {/*     Requires: {level.prerequisites.join(', ')} */}
              {/*   </div> */}
              {/* )} */}
              {/* </div> */}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-8 px-6 pt-1 xl:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-8">
              <Section title="Expectations" items={level.expectations} sectionType="expectations" />

              <Section title="Core Skills" items={level.skills} sectionType="skills" />

              {/* Tools Section */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  {SECTION_ICONS.tools && <SECTION_ICONS.tools className="h-5 w-5" />}
                  <h3 className="text-lg font-semibold">Technologies & Tools</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {level.tools.map((tool, index) => (
                    <Badge key={index} className="text-primary bg-gray-200">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              <Section
                title="Knowledge Requirements"
                items={level.knowledge}
                sectionType="knowledge"
              />
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                {SECTION_ICONS.toAdvance && <SECTION_ICONS.toAdvance className="h-5 w-5" />}
                <h3 className="text-lg font-semibold">Path to Advancement</h3>
              </div>
              <Card className="shadow-primary/5 border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-50 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-800">Next Level Goals</span>
                  </div>
                  <ul className="space-y-4">
                    {level.toAdvance.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500"></div>
                        <span className="text-emerald-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>

        <Separator className="mt-4" />

        <CardFooter className="py-1">
          <div className="flex w-full gap-4">
            <Can I="update" a="BucketLevel" ability={ability}>
              <Button onClick={() => onEditLevel(level)} className="flex-1">
                <Edit2 className="mr-2 size-4" />
                Edit Level
              </Button>
            </Can>

            <Button variant="outline" className="border-primary/30 flex-1">
              <TrendingUp className="mr-2 size-4" />
              Track Progress
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
