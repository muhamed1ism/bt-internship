import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Switch } from '@app/components/ui/switch';
import { useState } from 'react';
import { LevelSystem } from '@app/components/LevelSystem';
import { SectionBlock } from '@app/components/SectionBlock';

export const BucketView = () => {
  const navigate = useNavigate();
  const { bucketId } = useParams();
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
    <div className="flex w-full min-h-full h-auto flex-col items-center justify-start bg-gray-100 pt-10 pb-10">
      <div className="w-full px-10 mb-6">
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

      <div className="flex flex-row items-center justify-between gap-2 w-[30%] pt-10 scale-125">
        <p className="pl-4">To Advance:</p>
        <Switch 
          className="cursor-pointer"
          checked={isAdvanceMode}
          onCheckedChange={setIsAdvanceMode}
        />
      </div>

      <div className="w-[50%] max-w-4xl px-6 flex flex-col justify-evenly pt-10">
        {!isAdvanceMode ? (
          <>
            <SectionBlock title="Your Level Expectations" bgColor={getSectionBgColor(selectedLevel)}>
              <ul className="list-['-_']">
                <li>Independently lead development of full-stack features, from front-end UI to back-end APIs.</li>
                <li>Collaborate with PMs, designers and QA engineers to deliver high quality products.</li>
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
                {[
                  { name: 'React.js', bg: 'bg-blue-400' },
                  { name: 'Vue', bg: 'bg-green-500' },
                  { name: 'Express.js', bg: 'bg-gray-600' },
                  { name: 'AWS', bg: 'bg-orange-500' },
                ].map((tool, index) => (
                  <div
                    key={index}
                    className={`flex h-8 px-4 flex-col items-center justify-center rounded-md border-2 border-black ${tool.bg}`}
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

            <div className={`w-full h-4 transition-colors duration-200 ${getSectionBgColor(selectedLevel)}`}></div>
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
            <div className={`w-full h-4 transition-colors duration-200 ${getSectionBgColor(selectedLevel)}`}></div>
          </>
        )}
      </div>
    </div>
  );
};
