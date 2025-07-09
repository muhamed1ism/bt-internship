import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Eye, Edit3, Users } from 'lucide-react';
import { TeamCardProps } from '@app/types/team';
import { DEFAULT_TEAM } from '@mocks/teams';

export const TeamCard = ({
  teamNumber,
  teamLead,
  viewMode = 'grid',
  memberCount = 5,
  onView,
  onEdit,
}: TeamCardProps = DEFAULT_TEAM) => {

  // Generate initials for avatars
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const leadInitials = getInitials(teamLead.firstName, teamLead.lastName);

  // List view variant
  if (viewMode === 'list') {
    return (
      <Card className="group border-border/50 hover:border-border transition-all duration-200 hover:shadow-md">
        <CardContent className="px-6 py-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Compact Avatar Group */}
              <div className="relative">
                {/* Three Aligned Avatar Circles */}
                <div className="flex items-center justify-center">
                  {/* Left Avatar */}
                  <Avatar className="relative z-10 h-10 w-10 border-1 border-white">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamNumber}-1`}
                    />
                    <AvatarFallback className="bg-gray-200 text-xs font-medium text-gray-700">
                      T{teamNumber}
                    </AvatarFallback>
                  </Avatar>

                  {/* Center Avatar (Team Lead) - Overlapping */}
                  <Avatar className="relative z-20 -mx-1.5 h-14 w-14 border-3 border-white">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamLead.firstName}-${teamLead.lastName}`}
                    />
                    <AvatarFallback className="bg-gray-800 text-sm font-semibold text-white">
                      {leadInitials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Right Avatar */}
                  <Avatar className="relative z-10 h-10 w-10 border-1 border-white">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamNumber}-3`}
                    />
                    <AvatarFallback className="bg-gray-200 text-xs font-medium text-gray-700">
                      M{teamNumber}
                    </AvatarFallback>
                  </Avatar>

                  {/* Show remaining members count if more than 3 members */}
                  {memberCount > 3 && (
                    <div className="relative z-10 -ml-1.5 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-gray-200 text-xs font-medium text-gray-700">
                      +{memberCount - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Team Info */}
              <div className="ml-6 flex-1">
                <div className="flex flex-col items-center gap-4">
                  <div>
                    <h3 className="text-foreground ml-2 text-2xl font-bold">Team {teamNumber}</h3>
                    <div className="text-muted-foreground ml-3 flex items-center text-sm">
                      <Users className="mr-1 h-3 w-3" />
                      <span>
                        {memberCount} member{memberCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-muted-foreground text-sm font-medium">Team Lead</p>
                    <p className="text-foreground font-semibold">
                      {teamLead.firstName} {teamLead.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex h-full flex-col gap-4">
              <Button
                onClick={onView}
                variant="outline"
                size="lg"
                className="group-hover:border-primary/50 transition-colors"
              >
                <Eye className="mr-1 h-6 w-6" />
                View
              </Button>
              <Button
                onClick={onEdit}
                size="lg"
                className="border-amber-500 bg-amber-500 text-white hover:border-amber-600 hover:bg-amber-600"
              >
                <Edit3 className="mr-1 h-6 w-6" />
                Edit
              </Button>
            </div>
          </div>

          {/* Mobile Team Lead Info */}
          <div className="border-border/50 mt-3 border-t pt-3 sm:hidden">
            <p className="text-muted-foreground text-sm font-medium">Team Lead</p>
            <p className="text-foreground font-semibold">
              {teamLead.firstName} {teamLead.lastName}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view variant (default)
  return (
    <Card className="group border-border/50 hover:border-border relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="px-2 py-4">
        {/* Team Avatar Circles */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            {/* Three Aligned Avatar Circles */}
            <div className="flex items-center justify-center">
              {/* Left Avatar */}
              <Avatar className="relative z-10 h-12 w-12 border-1 border-white">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamNumber}-1`}
                />
                <AvatarFallback className="bg-gray-200 text-xs font-medium text-gray-700">
                  T{teamNumber}
                </AvatarFallback>
              </Avatar>

              {/* Center Avatar (Team Lead) - Overlapping */}
              <Avatar className="relative z-20 -mx-2 h-16 w-16 border-4 border-white">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamLead.firstName}-${teamLead.lastName}`}
                />
                <AvatarFallback className="bg-gray-800 text-sm font-semibold text-white">
                  {leadInitials}
                </AvatarFallback>
              </Avatar>

              {/* Right Avatar */}
              <Avatar className="relative z-10 h-12 w-12 border-1 border-white">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamNumber}-3`}
                />
                <AvatarFallback className="bg-gray-200 text-xs font-medium text-gray-700">
                  M{teamNumber}
                </AvatarFallback>
              </Avatar>

              {/* Show remaining members count if more than 3 members */}
              {memberCount > 3 && (
                <div className="relative z-10 -ml-2 flex h-12 w-12 items-center justify-center rounded-full border border-white bg-gray-200 text-xs font-medium text-gray-700">
                  +{memberCount - 3}
                </div>
              )}
            </div>

            {/* Team Icon Overlay */}
            {/* <div className="bg-primary border-background absolute -right-1 -bottom-1 rounded-full border-2 p-1.5 shadow-sm">
              <Users className="text-primary-foreground h-3 w-3" />
            </div> */}
          </div>
        </div>

        {/* Team Info */}
        <div className="cursor-pointer space-y-6 text-center" onClick={onView}>
          <div>
            <h3 className="text-foreground mb-1 text-2xl font-bold">Team {teamNumber}</h3>
            <div className="text-muted-foreground flex items-center justify-center text-sm">
              <Users className="mr-1 h-3 w-3" />
              <span>
                {memberCount} member{memberCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Team Lead</p>
            <p className="text-foreground font-semibold">
              {teamLead.firstName} {teamLead.lastName}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pt-0 pb-0">
        <div className="flex w-full gap-3">
          <Button
            onClick={onView}
            variant="outline"
            size="default"
            className="flex-1 transition-colors"
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
          <Button
            onClick={onEdit}
            size="default"
            className="flex-1 border-amber-500 bg-amber-500 text-white hover:border-amber-600 hover:bg-amber-600"
          >
            <Edit3 className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
