import arrowPng from '../../assets/logo/iconmonstr-arrow-right-thin-64.png';

interface LevelSystemProps {
  currentLevel: number;
  totalLevels: number;
  title: string;
  onLevelClick: (level: number) => void;
  fixedCurrentLevel: number;
  fixedNextLevel: number;
}

export const LevelSystem = ({ 
  currentLevel, 
  totalLevels, 
  title,
  onLevelClick,
  fixedCurrentLevel,
  fixedNextLevel
}: LevelSystemProps) => {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex w-full justify-around items-center" style={{ maxWidth: '1000px' }}>
        {Array.from({ length: totalLevels * 2 - 1 }).map((_, idx) => {
          if (idx % 2 === 0) {
            const circleIdx = Math.floor(idx / 2) + 1;
            return (
              <div
                key={`circle-${circleIdx}`}
                onClick={() => onLevelClick(circleIdx)}
                className={`cursor-pointer w-20 h-20 rounded-full flex items-center justify-center border border-black transition-all duration-200
                  ${circleIdx === fixedCurrentLevel ? 'bg-green-200 border-3' :
                    circleIdx === fixedNextLevel ? 'bg-cyan-200 border-2' :
                    circleIdx === currentLevel ? 'bg-gray-300' :
                    'bg-gray-100'}
                  ${circleIdx === currentLevel ? 'scale-125 mx-2' : 'hover:scale-110 hover:mx-1 mx-0'}
                `}
              >
                SE{circleIdx}
              </div>
            );
          } else {
            return (
              <img
                key={`arrow-${idx}`}
                src={arrowPng}
                alt="arrow"
                className="w-16 h-6 m-0 p-0 user-select-none"
              />
            );
          }
        })}
      </div>
      <div className="text-2xl font-semibold">
        {currentLevel === fixedCurrentLevel ? 'Current Level:' : 
         currentLevel < fixedCurrentLevel ? 'Previous Level:' : 
         'Next Level:'} {title} {currentLevel}
      </div>
    </div>
  );
}; 