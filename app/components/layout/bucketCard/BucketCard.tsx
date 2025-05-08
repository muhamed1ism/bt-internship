import React from 'react';
import { Button } from "@app/components/ui/button.tsx";
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
      // Handle taking the bucket
      console.log('Taking bucket:', id);
    }
  };

  return (
    <div
      className={`mr-8 flex w-[24%] ${isActive ? 'h-80' : 'h-auto'} min-h-50 flex-col justify-between rounded-4xl border-2 border-black p-4 ${
        isActive ? 'bg-white' : 'bg-gray-300'
      }`}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl">{title}</h1>

        {isActive && (
          <>
            <p>Current Level</p>
            <div className="flex h-8 w-10 flex-col items-center justify-center rounded-md border-2 border-black bg-green-200">
              <p>Lvl{currentLevel}</p>
            </div>

            <p>Goals</p>
            <div className="bg-blue border-black-200 flex w-40 flex-row items-end justify-between h-auto">
              <div className="flex h-8 w-10 flex-col items-center justify-center rounded-md border-2 border-black bg-cyan-200 scale-120">
                <p>Lvl{currentLevel+1}</p>
              </div>
              <div className="flex h-8 w-10 flex-col items-center justify-center rounded-md border-2 border-black bg-green-200">
                <p>Lvl{currentLevel+2}</p>
              </div>
              <div className="flex h-8 w-10 flex-col items-center justify-center rounded-md border-2 border-black bg-green-200">
                <p>Lvl{currentLevel+3}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-center">
        <Button 
          className="rounded-4xl w-full border-2 border-black bg-transparent text-black hover:text-white"
          onClick={handleClick}
        >
          {isActive ? 'Edit Bucket' : 'Take Bucket'}
        </Button>
      </div>
    </div>
  );
};

export default BucketCard;
