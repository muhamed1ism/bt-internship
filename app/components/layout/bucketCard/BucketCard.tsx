import React from 'react';
import { Button } from '@app/components/ui/button.tsx';
import { useNavigate } from 'react-router-dom';
import routeNames from '@app/routes/route-names';

interface CardProps {
  title: string;
  currentLevel: number;
  isActive: boolean;
  id: string;
}

const BucketCard: React.FC<CardProps> = ({ title, currentLevel, isActive, id }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isActive) {
      navigate(routeNames.bucketDefinition({ bucketId: id }));
    } else {
      console.log('Taking bucket:', id);
    }
  };

  // Calculate progress percentage (assuming max level is currentLevel + 3)
  const maxLevel = currentLevel + 3;
  const progressPercentage = (currentLevel / maxLevel) * 100;

  return (
    <div
      className={`group mr-8 flex w-[24%] ${isActive ? 'h-80' : 'h-auto'} relative min-h-50 transform cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg ${
        isActive
          ? 'bg-card text-card-foreground hover:bg-card/95'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
      onClick={handleClick}
    >
      {/* Gradient accent for active cards */}
      {isActive && (
        <div className="from-primary via-accent to-secondary absolute top-0 left-0 h-1 w-full bg-gradient-to-r" />
      )}

      <div className="flex flex-col gap-5">
        {/* Title with improved typography */}
        <div className="space-y-1">
          <h1 className="group-hover:text-primary flex flex-col text-2xl leading-tight font-bold transition-colors duration-200">
            {title.split(' ').map((word, index) => (
              <div key={index} className="leading-tight">
                {word}
              </div>
            ))}
          </h1>
          {!isActive && (
            <div className="flex items-center gap-2">
              <div className="bg-muted-foreground/40 h-2 w-2 rounded-full" />
              <span className="text-muted-foreground text-xs">Available to start</span>
            </div>
          )}
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
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className="from-primary to-accent h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Current level badge */}
              <div className="flex items-center gap-2">
                <div className="bg-accent text-accent-foreground flex h-10 w-10 flex-col items-center justify-center rounded-lg border-2 shadow-sm">
                  <p className="text-xs font-bold">LVL</p>
                  <p className="text-sm leading-none font-bold">{currentLevel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Current Level</p>
                  <p className="text-muted-foreground text-xs">Keep pushing forward!</p>
                </div>
              </div>
            </div>

            {/* Goals section with enhanced visual design */}
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm font-medium">Upcoming Goals</p>
              <div className="flex w-full flex-row items-center justify-between gap-2">
                {[1, 2, 3].map((offset, index) => {
                  const level = currentLevel + offset;
                  const isNext = offset === 1;
                  return (
                    <div key={level} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className={`flex h-8 w-8 flex-col items-center justify-center rounded-md border transition-all duration-200 ${
                          isNext
                            ? 'bg-primary text-primary-foreground border-primary scale-105 shadow-sm'
                            : 'bg-secondary/50 text-secondary-foreground border-secondary/30'
                        }`}
                      >
                        <p className="text-xs font-bold">{level}</p>
                      </div>
                      {isNext && <div className="bg-primary h-1 w-1 animate-pulse rounded-full" />}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center">
                <span className="text-muted-foreground bg-muted/50 rounded-full px-2 py-1 text-xs">
                  Next milestone at Level {currentLevel + 1}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced button section */}
      <div className="flex justify-center pt-6">
        <Button
          variant={isActive ? 'default' : 'outline'}
          className={`w-full transition-all duration-200 ${
            isActive
              ? 'from-primary to-primary/90 hover:from-primary/90 hover:to-primary bg-gradient-to-r shadow-md hover:shadow-lg'
              : 'hover:bg-primary hover:text-primary-foreground hover:border-primary border-2'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <span className="font-medium">{isActive ? '✏️ Edit Bucket' : '🚀 Start Journey'}</span>
        </Button>
      </div>

      {/* Decorative elements for inactive cards */}
      {!isActive && (
        <div className="absolute top-4 right-4 opacity-20 transition-opacity duration-200 group-hover:opacity-40">
          <div className="border-muted-foreground/30 flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed">
            <span className="text-xs">+</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BucketCard;
