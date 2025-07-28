import { Avatar, AvatarImage, AvatarFallback } from '@app/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Plus } from 'lucide-react';
import { User } from '@app/types/types';
import { AddMemberFormValues } from '@app/schemas';

interface AvailableUserCardProps {
  user: User;
  selectMember: ({ userId, position }: AddMemberFormValues) => void;
  viewMode?: 'grid' | 'list';
}

export const AvailableUserCard = ({
  user,
  selectMember,
  viewMode = 'grid',
}: AvailableUserCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const name = user.firstName + ' ' + user.lastName;

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
          <div className="mx-4 flex h-full items-center">
            <Button
              onClick={() => selectMember({ userId: user.id, position: '' })}
              variant="outline"
              size="lg"
              className="text-md rounded-lg border-blue-600 bg-blue-500 text-white hover:border-blue-700 hover:bg-blue-600 hover:text-white"
            >
              <Plus className="size-5" />
              Add
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="group border-border/50 hover:border-border flex h-92 flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="px-2 pt-8">
        {/* Avatar */}
        <div className="mb-2 flex justify-center">
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
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button
          onClick={() => selectMember({ userId: user.id, position: '' })}
          variant="outline"
          className="w-full border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};
