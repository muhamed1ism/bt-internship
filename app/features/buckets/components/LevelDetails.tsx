import { Edit2, TrendingUp, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Separator } from '@app/components/ui/separator';
import type { Level } from '@app/types/bucket';
import { STATUS_ICONS, SECTION_ICONS, DIFFICULTY_COLORS } from '@app/constants/bucket';
import { getStatusClasses, getSectionBackground, capitalize } from '@app/utils/bucket';

interface LevelDetailsProps {
  level: Level;
  onEditLevel: (level: Level) => void;
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
      <Card className={backgroundClass}>
        <CardContent className="p-4">
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <div
                  className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                    sectionType === 'skills'
                      ? 'bg-blue-500'
                      : sectionType === 'knowledge'
                        ? 'bg-orange-500'
                        : sectionType === 'toAdvance'
                          ? 'bg-green-500'
                          : 'bg-primary'
                  }`}
                ></div>
                <span className={sectionType === 'toAdvance' ? 'text-green-800' : ''}>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export const LevelDetails = ({ level, onEditLevel }: LevelDetailsProps) => {
  const renderStatusIcon = () => {
    const IconComponent = STATUS_ICONS[level.status];
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="lg:col-span-3">
      <Card className="shadow-lg">
        <CardHeader className="from-accent/20 to-secondary/20 border-b bg-gradient-to-r">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className={`rounded-lg p-2 ${getStatusClasses(level.status)}`}>
                  {renderStatusIcon()}
                </div>
                {level.title}
              </CardTitle>
              <div className="mt-3 flex items-center gap-4">
                <Badge variant="outline" className={DIFFICULTY_COLORS[level.difficulty]}>
                  {capitalize(level.difficulty)}
                </Badge>
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  {level.estimatedTime}
                </div>
                {level.prerequisites && level.prerequisites.length > 0 && (
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <ChevronRight className="h-4 w-4" />
                    Requires: {level.prerequisites.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
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
                    <Badge
                      key={index}
                      variant="secondary"
                      className="from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 bg-gradient-to-r transition-all"
                    >
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
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Next Level Goals</span>
                  </div>
                  <ul className="space-y-4">
                    {level.toAdvance.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"></div>
                        <span className="text-green-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex gap-3">
            <Button onClick={() => onEditLevel(level)} className="flex-1">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Level
            </Button>
            <Button variant="outline" className="px-6">
              <TrendingUp className="mr-2 h-4 w-4" />
              Track Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
