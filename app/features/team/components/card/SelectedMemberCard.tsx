import { Avatar, AvatarImage, AvatarFallback } from '@app/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import { User } from '@app/types/types';
import { AddMemberFormValues } from '@app/schemas';
import { Button } from '@app/components/ui/button';
import { Crown, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';

interface AvailableUserCardProps {
  user: User | undefined;
  member: AddMemberFormValues;
  changePosition: (userId: string, position: string) => void;
  deselectMember: (memberId: string) => void;
  viewMode?: 'grid' | 'list';
  showValidationError?: boolean;
}

const POSITIONS = [
  'Team Lead',
  'Tech Lead',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Project Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'QA Engineer',
  'Product Manager',
  'Scrum Master',
  'Business Analyst',
];

export const SelectedMemberCard = ({
  user,
  member,
  changePosition,
  deselectMember,
  viewMode = 'grid',
  showValidationError = false,
}: AvailableUserCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const name = user?.firstName + ' ' + user?.lastName;

  // List View
  if (viewMode === 'list') {
    return (
      <Card className="group border-border/50 hover:border-border flex h-36 flex-row justify-between py-0 transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex items-center gap-4 py-6">
          {/* Avatar */}
          <Avatar className="mx-4 h-18 w-18">
            <AvatarImage src={``} />
            <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          {/* Member Info */}
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-foreground truncate text-lg font-semibold">{name}</h3>
            </div>
            <p className="text-muted-foreground truncate text-sm">{user?.email}</p>
          </div>
        </CardHeader>
        <CardFooter className="p-2">
          {/* Actions */}
          <div className="ml-4 flex h-full items-center gap-6">
            {/* Select Position Component */}
            <Select
              value={member.position}
              onValueChange={(value) => changePosition(member.userId, value)}
            >
              <SelectTrigger
                className={`w-52 ${showValidationError && !member.position.trim() ? 'border-red-300 bg-red-50' : 'border-primary/30'}`}
              >
                <SelectValue placeholder="Select Position" />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex h-full items-start justify-end">
              <Button
                onClick={() => deselectMember(member.userId)}
                variant="ghost"
                className="m-0 h-8 w-8 hover:bg-red-50"
              >
                <X className="size-5 text-red-500" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="group border-border/50 hover:border-border flex h-92 flex-col justify-between px-0 pt-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="px-2">
        <div className="mb-2 flex justify-end">
          <Button
            onClick={() => deselectMember(member.userId)}
            variant="ghost"
            className="m-0 h-8 w-8 rounded-lg hover:bg-red-50"
          >
            <X className="size-5 text-red-500" />
          </Button>
        </div>

        {/* Avatar */}
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <Avatar className="h-18 w-18">
              <AvatarImage src={``} />
              <AvatarFallback className="bg-gray-200 text-lg font-medium text-gray-700">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardTitle className="text-center">
          <h3 className="text-foreground text-lg font-semibold">{name}</h3>
        </CardTitle>

        <CardDescription className="text-center">
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        {/* Select Position Component */}
        <Select
          value={member.position}
          onValueChange={(value) => changePosition(member.userId, value)}
        >
          <SelectTrigger
            className={`w-full ${showValidationError && !member.position.trim() ? 'border-red-300 bg-red-50' : 'border-primary/30'}`}
          >
            <SelectValue className="w-full" placeholder="Select Position" />
          </SelectTrigger>
          <SelectContent>
            {POSITIONS.map((position) => (
              <SelectItem key={position} value={position}>
                {position.toLowerCase().includes('lead') && <Crown />} {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
};
