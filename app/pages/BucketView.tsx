import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Switch } from '@app/components/ui/switch';
import { useState } from 'react';
import { LevelSystem } from '@app/components/LevelSystem';

export const BucketView = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(2);
  const [isAdvanceMode, setIsAdvanceMode] = useState(false);
  const currentLevel = 2;
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
    <div className="flex w-full h-screen flex-col items-center justify-start bg-gray-100 pt-10">
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
          <div className="flex flex-col">
            <h1 className={`text-3xl w-full h-15 pl-4 flex items-center transition-colors duration-200 ${getSectionBgColor(selectedLevel)}`}>
              Your Level Expectations
            </h1>
            <ul className="list-['-_'] pl-8 bg-gray-200 pt-5 pb-5">
              <li>
                Independently lead development of full-stack features, from front-end UI to back-end APIs.
              </li>
              <li>
                Collaborate with PMs, designers and QA engineers to deliver high quality products.
              </li>
            </ul>
            
            <div className="w-full">
              <h2 className={`text-3xl w-full h-15 pl-4 flex items-center transition-colors duration-200 ${getSectionBgColor(selectedLevel)}`}>
                Skills
              </h2>
              <ul className="list-['-_'] pl-8 bg-gray-200 pt-5 pb-5">
                <li>Front-End: React.js/Vue</li>
                <li>Back-End: Express.js</li>
                <li>Cloud: AWS</li>
              </ul>
            </div>

            <div className="w-full">
              <h2 className={`text-3xl w-full h-15 pl-4 flex items-center transition-colors duration-200 ${getSectionBgColor(selectedLevel)}`}>
                Tools
              </h2>
              <div className="flex flex-row gap-4 pl-8 bg-gray-200 pt-5 pb-5">
                <div className="flex h-8 px-4 flex-col items-center justify-center rounded-md border-2 border-black bg-blue-400">
                  <p className="font-semibold text-white">React.js</p>
                </div>
                <div className="flex h-8 px-4 flex-col items-center justify-center rounded-md border-2 border-black bg-green-500">
                  <p className="font-semibold text-white">Vue</p>
                </div>
                <div className="flex h-8 px-4 flex-col items-center justify-center rounded-md border-2 border-black bg-gray-600">
                  <p className="font-semibold text-white">Express.js</p>
                </div>
                <div className="flex h-8 px-4 flex-col items-center justify-center rounded-md border-2 border-black bg-orange-500">
                  <p className="font-semibold text-white">AWS</p>
                </div>
              </div>
            </div>

            <div className="w-full">
              <h2 className={`text-3xl w-full h-15 pl-4 flex items-center transition-colors duration-200 ${getSectionBgColor(selectedLevel)}`}>
                Knowledge
              </h2>
              <div className="space-y-2 pl-8 bg-gray-200 pt-5 pb-5">
                <p>Level 1: Basic description</p>
                <p>Level 2: Intermediate description</p>
                <p>Level 3: Advanced description</p>
              </div>
            </div>
            <div className={`w-full h-4 transition-colors duration-200 ${getSectionBgColor(selectedLevel)}`}></div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="w-full">
              <h2 className={`text-3xl w-full h-15 pl-4 flex items-center transition-colors duration-200 ${getSectionBgColor(selectedLevel)}`}>
                To Advance:
              </h2>
              <ul className="list-['-_'] pl-8 bg-gray-200 pt-5 pb-5">
                <li>Complete all current level requirements</li>
                <li>Demonstrate proficiency in next level skills</li>
                <li>Get approval from team lead</li>
                <li>Pass technical assessment</li>
              </ul>
            </div>
            <div className={`w-full h-4 transition-colors duration-200 ${getSectionBgColor(selectedLevel)}`}></div>
          </div>
        )}
      </div>
    </div>
  );
};