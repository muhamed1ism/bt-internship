import { Card, CardContent, CardFooter } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../components/ui/avatar';
import { Eye, Edit3, Users, UserRound } from 'lucide-react';
import { TeamCardProps } from '@app/types/team';
import { useAbility } from '@casl/react';
import { AbilityContext, Can } from '@app/casl/AbilityContext';

export const TeamCard = ({
  teamName,
  teamLeaders,
  viewMode = 'grid',
  memberCount = 0,
  onView,
  onEdit,
}: TeamCardProps) => {
  // Generate initials for avatars
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  const ability = useAbility(AbilityContext);

  // List view variant
  if (viewMode === 'list') {
    return (
      <Card className="group border-border/50 hover:border-border transition-all duration-200 hover:shadow-md">
        {/* TODO: Fix view of cards on <500px screens  */}
        <CardContent onClick={onView} className="px-6 py-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Compact Avatar Group */}
              <div className="relative">
                {/* Three Aligned Avatar Circles */}
                <div className="flex items-center justify-center">
                  {/* Left Avatar */}
                  <Avatar className="relative z-1 h-10 w-10 border-1 border-white">
                    <AvatarImage src={''} />
                    <AvatarFallback className="bg-neutral-200 text-xs font-medium text-neutral-700">
                      {teamLeaders[1] ? (
                        getInitials(teamLeaders[1].user.firstName, teamLeaders[1].user.lastName)
                      ) : (
                        <UserRound />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  {/* Center Avatar (Team Lead) - Overlapping */}
                  <Avatar className="relative z-2 -mx-1.5 h-14 w-14 border-3 border-white">
                    <AvatarImage src={``} />
                    <AvatarFallback className="bg-neutral-800 text-sm font-semibold text-white">
                      {teamLeaders[0] ? (
                        getInitials(teamLeaders[0].user.firstName, teamLeaders[0].user.lastName)
                      ) : (
                        <UserRound />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  {/* Right Avatar */}
                  <Avatar className="relative z-1 h-10 w-10 border-1 border-white">
                    <AvatarImage src={``} />
                    <AvatarFallback className="bg-neutral-200 text-xs font-medium text-neutral-700">
                      {teamLeaders[2] ? (
                        getInitials(teamLeaders[2].user.firstName, teamLeaders[2].user.lastName)
                      ) : (
                        <UserRound />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Team Info */}
              <div className="ml-6">
                <div className="flex flex-col items-center justify-start gap-4">
                  <div className="w-full">
                    <h3 className="text-foreground text-2xl font-bold">{teamName}</h3>
                    <div className="text-muted-foreground flex items-center text-sm">
                      <Users className="mr-1 h-3 w-3" />
                      <span>{memberCount} members</span>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <p className="text-muted-foreground text-sm font-medium">Team Lead</p>
                    <p className="text-foreground line-clamp-2 max-w-1/2 font-semibold sm:max-w-3/4 md:max-w-2/3">
                      {teamLeaders
                        .map((lead) => {
                          return `${lead.user.firstName} ${lead.user.lastName}`;
                        })
                        .join(', ')}
                      , Some User, Some User 2, Some User 3 , Some User, Some User 2, Some User 3 ,
                      Some User, Some User 2, Some User 3 , Some User, Some User 2, Some User 3
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
              <Can I="update" a="Team" ability={ability}>
                <Button
                  onClick={onEdit}
                  size="lg"
                  className="border-amber-500 bg-amber-500 text-white hover:border-amber-600 hover:bg-amber-600"
                >
                  <Edit3 className="mr-1 h-6 w-6" />
                  Edit
                </Button>
              </Can>
            </div>
          </div>

          {/* Mobile Team Lead Info */}
          {teamLeaders && teamLeaders.length > 0 && (
            <div className="border-border/50 mt-3 border-t pt-3 md:hidden">
              <p className="text-muted-foreground text-sm font-medium">Team Lead</p>
              <p className="text-foreground font-semibold">
                {teamLeaders
                  .map((lead) => {
                    return `${lead.user.firstName} ${lead.user.lastName}`;
                  })
                  .join(', ')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Grid view variant (default)
  return (
    <Card className="group border-border/50 hover:border-border relative cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardContent onClick={onView} className="h-full w-full px-2 py-4">
        {/* Team Avatar Circles */}
        <div className="mb-6 flex w-full items-center justify-center">
          <div className="relative">
            {/* Three Aligned Avatar Circles */}
            <div className="flex items-center justify-center">
              {/* Left Avatar */}
              <Avatar className="relative z-1 h-12 w-12 border-1 border-white">
                <AvatarImage src={``} />
                <AvatarFallback className="bg-neutral-200 text-xs font-medium text-neutral-700">
                  {teamLeaders[1] ? (
                    getInitials(teamLeaders[1].user.firstName, teamLeaders[1].user.lastName)
                  ) : (
                    <UserRound />
                  )}
                </AvatarFallback>
              </Avatar>

              {/* Center Avatar (Team Lead) - Overlapping */}
              <Avatar className="relative z-2 -mx-2 h-16 w-16 border-4 border-white">
                <AvatarImage src={``} />
                <AvatarFallback className="bg-neutral-800 text-sm font-semibold text-white">
                  {teamLeaders[0] ? (
                    getInitials(teamLeaders[0].user.firstName, teamLeaders[0].user.lastName)
                  ) : (
                    <UserRound />
                  )}
                </AvatarFallback>
              </Avatar>

              {/* Right Avatar */}
              <Avatar className="relative z-1 h-12 w-12 border-1 border-white">
                <AvatarImage src={``} />
                <AvatarFallback className="bg-neutral-200 text-xs font-medium text-neutral-700">
                  {teamLeaders[2] ? (
                    getInitials(teamLeaders[2].user.firstName, teamLeaders[2].user.lastName)
                  ) : (
                    <UserRound />
                  )}
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
        <div className="w-full cursor-pointer space-y-6 text-center">
          <div>
            <h3 className="text-foreground mb-1 line-clamp-2 px-2 text-2xl font-bold">
              {teamName}
            </h3>
            <div className="text-muted-foreground flex items-center justify-center text-sm">
              <Users className="mr-1 h-3 w-3" />
              <span>
                {memberCount} member{memberCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {teamLeaders && teamLeaders.length > 0 && (
              <p className="text-muted-foreground text-sm font-medium">Team Lead</p>
            )}
            <p className="text-foreground line-clamp-2 px-4 font-semibold">
              {teamLeaders
                .map((lead) => {
                  return `${lead.user.firstName} ${lead.user.lastName}`;
                })
                .join(', ')}
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
            className="border-primary/30 flex-1 transition-colors"
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
          <Can I="update" a="Team" ability={ability}>
            <Button
              onClick={onEdit}
              size="default"
              className="flex-1 border-yellow-600 bg-yellow-400 text-black hover:border-yellow-700 hover:bg-yellow-500"
            >
              <Edit3 className="mr-1 h-4 w-4" />
              Edit
            </Button>
          </Can>
        </div>
      </CardFooter>
    </Card>
  );
};
