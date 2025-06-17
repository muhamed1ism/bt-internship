import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Switch } from '@app/components/ui/switch';
import { useState } from 'react';
import clsx from 'clsx';
import { LevelSystem } from '@app/components/LevelSystem';
import { SectionBlock } from '@app/components/SectionBlock';
import { TOOLS } from '@app/constants/constants';

export const BucketView = () => {
  const navigate = useNavigate();
  const currentLevel = 2;
  const [selectedLevel, setSelectedLevel] = useState(currentLevel);
  const [isAdvanceMode, setIsAdvanceMode] = useState(false);
  const nextLevel = currentLevel + 1;

  const handleLevelClick = (level: number) => {
    setSelectedLevel(level);
  };

  const getSectionBgColor = (level: number) => {
    if (level === currentLevel) return 'bg-green-200';
    if (level === nextLevel) return 'bg-cyan-200';
    return 'bg-gray-300';
  };

  return (
    <div className="flex h-auto min-h-full w-full flex-col items-center justify-start bg-gray-100 pt-10 pb-10">
      <div className="mb-6 w-full px-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/buckets')}
          className="hover:bg-gray-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      <LevelSystem
        currentLevel={selectedLevel}
        totalLevels={6}
        title="Software Engineer"
        onLevelClick={handleLevelClick}
        fixedCurrentLevel={currentLevel}
        fixedNextLevel={nextLevel}
      />

      <div className="flex w-[30%] scale-125 flex-row items-center justify-between gap-2 pt-10">
        <p className="pl-4">To Advance:</p>
        <Switch
          className="cursor-pointer"
          checked={isAdvanceMode}
          onCheckedChange={setIsAdvanceMode}
        />
      </div>

      <div className="flex w-[50%] max-w-4xl flex-col justify-evenly px-6 pt-10">
        {!isAdvanceMode ? (
          <>
            <SectionBlock
              title="Your Level Expectations"
              bgColor={getSectionBgColor(selectedLevel)}
            >
              <ul className="list-['-_']">
                <li>
                  Independently lead development of full-stack features, from front-end UI to
                  back-end APIs.
                </li>
                <li>
                  Collaborate with PMs, designers and QA engineers to deliver high quality products.
                </li>
              </ul>
            </SectionBlock>

            <SectionBlock title="Skills" bgColor={getSectionBgColor(selectedLevel)}>
              <ul className="list-['-_']">
                <li>Front-End: React.js/Vue</li>
                <li>Back-End: Express.js</li>
                <li>Cloud: AWS</li>
              </ul>
            </SectionBlock>

            <SectionBlock title="Tools" bgColor={getSectionBgColor(selectedLevel)}>
              <div className="flex flex-row gap-4">
                {TOOLS.map((tool, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'flex h-8 flex-col items-center justify-center rounded-md border-2 border-black px-4',
                      tool.bg,
                    )}
                  >
                    <p className="font-semibold text-white">{tool.name}</p>
                  </div>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock title="Knowledge" bgColor={getSectionBgColor(selectedLevel)}>
              <div className="space-y-2">
                <p>Level 1: Basic description</p>
                <p>Level 2: Intermediate description</p>
                <p>Level 3: Advanced description</p>
              </div>
            </SectionBlock>

            <div
              className={clsx(
                'h-4 w-full transition-colors duration-200',
                getSectionBgColor(selectedLevel),
              )}
            ></div>
          </>
        ) : (
          <>
            <SectionBlock title="To Advance:" bgColor={getSectionBgColor(selectedLevel)}>
              <ul className="list-['-_']">
                <li>Complete all current level requirements</li>
                <li>Demonstrate proficiency in next level skills</li>
                <li>Get approval from team lead</li>
                <li>Pass technical assessment</li>
              </ul>
            </SectionBlock>
            <div
              className={clsx(
                'h-4 w-full transition-colors duration-200',
                getSectionBgColor(selectedLevel),
              )}
            ></div>
          </>
        )}
      </div>
    </div>
  );
};
