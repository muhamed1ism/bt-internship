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
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Compact Avatar Group */}
              <div className="relative">
                {/* Three Aligned Avatar Circles */}
                <div className="flex items-center justify-center">
                  {/* Left Avatar */}
                  <Avatar className="relative z-10 h-8 w-8 border-2 border-white shadow-lg">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamNumber}-1`}
                    />
                    <AvatarFallback className="bg-gray-200 text-xs font-medium text-gray-700">
                      T{teamNumber}
                    </AvatarFallback>
                  </Avatar>

                  {/* Center Avatar (Team Lead) - Overlapping */}
                  <Avatar className="relative z-20 -mx-1.5 h-10 w-10 border-2 border-white shadow-lg">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamLead.firstName}-${teamLead.lastName}`}
                    />
                    <AvatarFallback className="bg-gray-800 text-sm font-semibold text-white">
                      {leadInitials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Right Avatar */}
                  <Avatar className="relative z-10 h-8 w-8 border-2 border-white shadow-lg">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamNumber}-3`}
                    />
                    <AvatarFallback className="bg-gray-200 text-xs font-medium text-gray-700">
                      M{teamNumber}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Team Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-foreground text-lg font-bold">Team {teamNumber}</h3>
                    <div className="text-muted-foreground flex items-center text-sm">
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
            <div className="flex gap-2">
              <Button
                onClick={onView}
                variant="outline"
                size="sm"
                className="group-hover:border-primary/50 transition-colors"
              >
                <Eye className="mr-1 h-4 w-4" />
                View
              </Button>
              <Button
                onClick={onEdit}
                size="sm"
                className="border-amber-500 bg-amber-500 text-white hover:border-amber-600 hover:bg-amber-600"
              >
                <Edit3 className="mr-1 h-4 w-4" />
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
      <CardContent className="p-6">
        {/* Team Avatar Circles */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            {/* Three Aligned Avatar Circles */}
            <div className="flex items-center justify-center">
              {/* Left Avatar */}
              <Avatar className="relative z-10 h-10 w-10 border-2 border-white shadow-lg">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamNumber}-1`}
                />
                <AvatarFallback className="bg-gray-200 text-xs font-medium text-gray-700">
                  T{teamNumber}
                </AvatarFallback>
              </Avatar>

              {/* Center Avatar (Team Lead) - Overlapping */}
              <Avatar className="relative z-20 -mx-2 h-12 w-12 border-2 border-white shadow-lg">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamLead.firstName}-${teamLead.lastName}`}
                />
                <AvatarFallback className="bg-gray-800 text-sm font-semibold text-white">
                  {leadInitials}
                </AvatarFallback>
              </Avatar>

              {/* Right Avatar */}
              <Avatar className="relative z-10 h-10 w-10 border-2 border-white shadow-lg">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamNumber}-3`}
                />
                <AvatarFallback className="bg-gray-200 text-xs font-medium text-gray-700">
                  M{teamNumber}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Team Icon Overlay */}
            {/* <div className="bg-primary border-background absolute -right-1 -bottom-1 rounded-full border-2 p-1.5 shadow-sm">
              <Users className="text-primary-foreground h-3 w-3" />
            </div> */}
          </div>
        </div>

        {/* Team Info */}
        <div className="space-y-3 text-center">
          <div>
            <h3 className="text-foreground mb-1 text-xl font-bold">Team {teamNumber}</h3>
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

      <CardFooter className="px-6 pt-0 pb-6">
        <div className="flex w-full gap-3">
          <Button
            onClick={onView}
            variant="outline"
            size="sm"
            className="group-hover:border-primary/50 flex-1 transition-colors"
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
          <Button
            onClick={onEdit}
            size="sm"
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
