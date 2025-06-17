import clsx from 'clsx';
import arrowPng from '../../assets/logo/iconmonstr-arrow-right-thin-64.png';

interface LevelSystemProps {
  currentLevel: number;
  totalLevels: number;
  title: string;
  onLevelClick: (level: number) => void;
  fixedCurrentLevel: number;
  fixedNextLevel: number;
}

const getCircleStyles = (
  circleIdx: number,
  currentLevel: number,
  fixedCurrentLevel: number,
  fixedNextLevel: number,
) => {
  const baseClasses =
    'cursor-pointer w-20 h-20 rounded-full flex items-center justify-center border border-black transition-all duration-200';

  let backgroundClass = 'bg-gray-100';
  if (circleIdx === fixedCurrentLevel) backgroundClass = 'bg-green-200 border-3';
  else if (circleIdx === fixedNextLevel) backgroundClass = 'bg-cyan-200 border-2';
  else if (circleIdx === currentLevel) backgroundClass = 'bg-gray-300';

  const scaleClass =
    circleIdx === currentLevel ? 'scale-125 mx-2' : 'hover:scale-110 hover:mx-1 mx-0';

  return clsx(baseClasses, backgroundClass, scaleClass);
};

const getLevelText = (currentLevel: number, fixedCurrentLevel: number, fixedNextLevel: number) => {
  if (currentLevel === fixedCurrentLevel) return 'Current Level:';
  if (currentLevel < fixedCurrentLevel) return 'Previous Level:';
  if (currentLevel === fixedNextLevel) return 'Next Level:';
  return 'Level:';
};

export const LevelSystem = ({
  currentLevel,
  totalLevels,
  title,
  onLevelClick,
  fixedCurrentLevel,
  fixedNextLevel,
}: LevelSystemProps) => {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex w-full items-center justify-around" style={{ maxWidth: '1000px' }}>
        {Array.from({ length: totalLevels * 2 - 1 }).map((_, idx) => {
          if (idx % 2 === 0) {
            const circleIdx = Math.floor(idx / 2) + 1;
            return (
              <div
                key={`circle-${circleIdx}`}
                onClick={() => onLevelClick(circleIdx)}
                className={getCircleStyles(
                  circleIdx,
                  currentLevel,
                  fixedCurrentLevel,
                  fixedNextLevel,
                )}
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
                className="user-select-none m-0 h-6 w-16 p-0"
              />
            );
          }
        })}
      </div>
      <div className="text-2xl font-semibold">
        {getLevelText(currentLevel, fixedCurrentLevel, fixedNextLevel)} {title} {currentLevel}
      </div>
    </div>
  );
};
