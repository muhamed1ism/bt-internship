import { Avatar, AvatarImage, AvatarFallback } from '@app/components/ui/avatar';
import { Button } from '@app/components/ui/button';
import { Card, CardContent } from '@app/components/ui/card';
import { Badge } from '@app/components/ui/badge';
import { Users, Edit3, Settings, Calendar, UserRound } from 'lucide-react';
import { Team } from '@app/types/team';
import { splitToWords } from '@app/utils/splitToWords';

interface TeamHeaderProps {
  team: Team;
  onManageMembers?: () => void;
  onEdit?: () => void;
}

export const TeamHeader = ({ team, onManageMembers, onEdit }: TeamHeaderProps) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const statusBadgeClass =
    team.status === 'ACTIVE'
      ? 'bg-blue-500 text-white'
      : team.status === 'CRITICAL'
        ? 'bg-red-400 text-white'
        : team.status === 'IN_PROGRESS'
          ? 'bg-yellow-400 text-black'
          : team.status === 'COMPLETED'
            ? 'bg-green-500 text-white'
            : 'bg-gray-500 text-white';

  const status = team.status.replace('_', ' ');

  return (
    <Card className="mb-8">
      <CardContent className="px-6 py-5">
        <div className="flex h-full flex-col lg:flex-row">
          {/* Team Info Section */}
          <div className="flex-1">
            <div className="mb-6 flex w-full flex-col items-center gap-6">
              {/* Team Avatar Circles */}
              <div className="relative">
                <div className="flex items-center justify-center">
                  {/* Left Avatar */}
                  <Avatar className="relative z-1 h-12 w-12 border-1 border-white">
                    <AvatarImage src={``} />
                    <AvatarFallback className="bg-neutral-200 text-sm font-medium text-neutral-700">
                      {team.members && team.members[1] ? (
                        getInitials(team.members[1].user.firstName, team.members[1].user.lastName)
                      ) : (
                        <UserRound />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  {/* Center Avatar (Team Lead) */}
                  <Avatar className="relative z-2 -mx-3 h-16 w-16 border-4 border-white">
                    <AvatarImage src={``} />
                    <AvatarFallback className="bg-neutral-800 text-lg font-semibold text-white">
                      {team.members && team.members[0] ? (
                        getInitials(team.members[0].user.firstName, team.members[0].user.lastName)
                      ) : (
                        <UserRound />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  {/* Right Avatar */}
                  <Avatar className="relative z-1 h-12 w-12 border-1 border-white">
                    <AvatarImage src={``} />
                    <AvatarFallback className="bg-neutral-200 text-sm font-medium text-neutral-700">
                      {team.members && team.members[2] ? (
                        getInitials(team.members[2].user.firstName, team.members[2].user.lastName)
                      ) : (
                        <UserRound />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Team Title and Stats */}
              <div className="flex-1">
                <h1 className="text-foreground mb-2 text-center text-3xl font-bold">{team.name}</h1>
                <div className="text-muted-foreground mb-3 flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{team._count.members} members</span>
                  </div>
                  {/* <div className="flex items-center gap-1"> */}
                  {/*   <Target className="h-4 w-4" /> */}
                  {/*   <span>{team.stats.activeMembers} active</span> */}
                  {/* </div> */}
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={statusBadgeClass}>{splitToWords(status.toLowerCase())}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3">
                <Button
                  onClick={onManageMembers}
                  variant="outline"
                  size="lg"
                  className="border-primary/30 hover:border-primary/50 transition-colors"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Members
                </Button>
                <Button
                  onClick={onEdit}
                  size="lg"
                  className="border-yellow-600 bg-yellow-400 text-black hover:border-yellow-700 hover:bg-yellow-500"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Project Info Section */}
          {team && (
            <div className="h-full lg:w-[50%]">
              <div className="bg-muted rounded-lg p-4 inset-shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-foreground font-semibold">Current Project</h3>
                  <Badge>{status}</Badge>
                </div>

                <h4 className="mb-2 text-lg font-medium">{team.name}</h4>

                <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3" />
                  <span>Start Date: {new Date(team.startDate).toLocaleDateString()}</span>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                  {team.projectDescription}
                </p>

                {/* Progress Bar */}
                {/* <div className="space-y-2"> */}
                {/*   <div className="flex justify-between text-sm"> */}
                {/*     <span className="text-muted-foreground">Progress</span> */}
                {/*     <span className="font-medium">{team.progress}%</span> */}
                {/*   </div> */}
                {/*   <div className="h-2 w-full rounded-full bg-gray-200"> */}
                {/*     <div */}
                {/*       className="bg-primary h-2 rounded-full transition-all duration-300" */}
                {/*       style={{ width: `${team.project.progress}%` }} */}
                {/*     /> */}
                {/*   </div> */}
                {/* </div> */}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
