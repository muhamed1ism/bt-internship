import React from 'react';
import { useNavigate } from 'react-router-dom';
import routeNames from '@app/routes/route-names';

interface CardProps {
  title: string;
  currentLevel: number;
  isActive: boolean;
  id: string;
  maxLevel: number;
}

const BucketCard: React.FC<CardProps> = ({ title, currentLevel, isActive, id, maxLevel }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(routeNames.bucketView({ bucketId: id }));
  };

  // Calculate progress percentage
  const progressPercentage = maxLevel > 0 ? (currentLevel / maxLevel) * 100 : 0;

  return (
    <div
      className={`group relative flex min-h-50 transform cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg ${
        isActive
          ? 'bg-card text-card-foreground hover:bg-card/95'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
      onClick={handleClick}
    >
      {/* Gradient accent for active cards */}
      {isActive && (
        <div className="from-primary via-primary/60 to-primary/40 absolute top-0 left-0 h-1 w-full bg-gradient-to-r" />
      )}

      <div className="flex flex-col gap-6">
        {/* Title with improved typography */}
        <div className="space-y-1 min-h-[4.5rem] flex flex-col justify-center">
          <h1 className="group-hover:text-primary flex flex-col text-3xl leading-tight font-bold transition-colors duration-200">
            {title &&
              title.split(' ').map((word, index) => (
                <div key={index} className="leading-tight">
                  {word}
                </div>
              ))}
          </h1>
        </div>

        {isActive && (
          <>
            {/* Progress section with visual indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm font-medium">Current Progress</p>
                <span className="text-primary text-xs font-medium">
                  {Math.round(progressPercentage)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="bg-muted mb-4 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="from-primary to-primary/50 h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Current level badge */}
              <div className="mb-6 flex items-center gap-4">
                <div className="bg-accent text-accent-foreground flex h-11 w-11 flex-col items-center justify-center rounded-lg border-1 shadow-md shadow-black/10">
                  <p className="text-xs font-bold">LVL</p>
                  <p className="text-md leading-none font-bold">{currentLevel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-md font-medium">Current Level</p>
                  <p className="text-muted-foreground text-sm">Keep pushing forward!</p>
                </div>
              </div>
            </div>

            {/* Goals section with enhanced visual design */}
            <div className="space-y-3 flex flex-col h-32">
              <p className="text-muted-foreground text-center text-sm font-medium">
                {currentLevel >= maxLevel ? 'Achievement Unlocked' : 'Upcoming Goals'}
              </p>
              {currentLevel < maxLevel ? (
                <>
                  <div className="flex w-full flex-row items-center justify-center gap-4 flex-1">
                    {Array.from({ length: Math.min(4, maxLevel - currentLevel) }, (_, index) => {
                      const level = currentLevel + index + 1;
                      const isNext = index === 0;
                      return (
                        <div key={level} className="flex flex-col items-center gap-1">
                          <div
                            className={`flex h-9 w-9 flex-col items-center justify-center rounded-md border transition-all duration-200 ${
                              isNext
                                ? 'bg-primary text-primary-foreground border-primary scale-105 shadow-sm'
                                : 'bg-primary/10 text-secondary-foreground border-secondary/30'
                            }`}
                          >
                            <p className="text-sm font-semibold">{level}</p>
                          </div>
                          {isNext && <div className="bg-primary h-1 w-1 animate-pulse rounded-full" />}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center mt-auto">
                    <span className="text-muted-foreground bg-muted/50 rounded-full px-2 py-1 text-xs">
                      {maxLevel - currentLevel === 1 ? (
                        <p>Final milestone at Level {maxLevel}</p>
                      ) : (
                        <p>Next milestone at Level {currentLevel + 1}</p>
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-center flex-1 items-center">
                  <span className="text-muted-foreground bg-muted/50 rounded-full px-2 py-1 text-xs">
                    <p>🏆 You have reached the top level!</p>
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BucketCard;
