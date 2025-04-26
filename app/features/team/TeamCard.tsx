import { Card, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '../../components/ui/avatar';

interface TeamCardProps {
  teamNumber: number;
  teamLead: {
    firstName: string;
    lastName: string;
  };
  onView?: () => void;
  onEdit?: () => void;
}

export const TeamCard = ({
  teamNumber,
  teamLead,
  onView,
  onEdit,
}: TeamCardProps) => {
  return (
    <Card className="relative flex h-72 w-64 flex-col items-center rounded-[2rem] border-2 border-black p-4">
      <div className="mt-4 mb-2 flex items-center justify-center">
        <div className="flex items-end -space-x-3">
          <Avatar className="relative z-1 h-12 w-12 border-2 border-black">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar className="relative z-2 h-16 w-16 border-2 border-black">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar className="relative z-1 h-12 w-12 border-2 border-black">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="w-full flex-1 space-y-1">
        <h3 className="bold text-center text-2xl font-medium">
          Team {teamNumber}
        </h3>
        <p className="text-left text-sm font-medium">Team Lead:</p>
        <p>
          {teamLead.firstName} {teamLead.lastName}
        </p>
      </div>

      <CardFooter className="flex w-full justify-between gap-4 pb-4">
        <Button
          onClick={onView}
          className="flex-1 rounded-lg border-1 border-black bg-[#a8d8ff] text-black hover:bg-[#8ac6ff]"
          variant="outline"
        >
          View
        </Button>
        <Button
          onClick={onEdit}
          className="flex-1 rounded-lg border-1 border-black bg-[#fff4a8] text-black hover:bg-[#ffef8a]"
          variant="outline"
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};
