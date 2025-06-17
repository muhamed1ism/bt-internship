import { Avatar, AvatarImage, AvatarFallback } from '@app/components/ui/avatar';
import { Button } from '@app/components/ui/button';
import { Card, CardContent } from '@app/components/ui/card';
import { Badge } from '@app/components/ui/badge';
import { Users, Edit3, Settings, Calendar, Target } from 'lucide-react';
import { TeamDetails } from '@app/types/team-member';

interface TeamHeaderProps {
  teamDetails: TeamDetails;
  onManageMembers?: () => void;
  onEdit?: () => void;
}

export const TeamHeader = ({ teamDetails, onManageMembers, onEdit }: TeamHeaderProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Team Info Section */}
          <div className="flex-1">
            <div className="mb-6 flex items-center gap-6">
              {/* Team Avatar Circles */}
              <div className="relative">
                <div className="flex items-center justify-center">
                  {/* Left Avatar */}
                  <Avatar className="relative z-10 h-12 w-12 border-2 border-white shadow-lg">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamDetails.teamNumber}-1`}
                    />
                    <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
                      T{teamDetails.teamNumber}
                    </AvatarFallback>
                  </Avatar>

                  {/* Center Avatar (Team Lead) */}
                  <Avatar className="relative z-20 -mx-3 h-16 w-16 border-2 border-white shadow-lg">
                    <AvatarImage
                      src={
                        teamDetails.teamLead.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${teamDetails.teamLead.name}`
                      }
                    />
                    <AvatarFallback className="bg-gray-800 text-lg font-semibold text-white">
                      {getInitials(teamDetails.teamLead.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Right Avatar */}
                  <Avatar className="relative z-10 h-12 w-12 border-2 border-white shadow-lg">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamDetails.teamNumber}-3`}
                    />
                    <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
                      M{teamDetails.teamNumber}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Team Title and Stats */}
              <div className="flex-1">
                <h1 className="text-foreground mb-2 text-3xl font-bold">
                  Team {teamDetails.teamNumber}
                </h1>
                <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{teamDetails.stats.totalMembers} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{teamDetails.stats.activeMembers} active</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-500 text-white">Active</Badge>
                  <Badge className="bg-red-500 text-white">Critical</Badge>
                  <Badge className="bg-orange-500 text-white">In Progress</Badge>
                  <Badge className="bg-green-500 text-white">Completed</Badge>
                  <Badge className="bg-gray-500 text-white">On Hold</Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onManageMembers}
                variant="outline"
                className="group-hover:border-primary/50 transition-colors"
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Members
              </Button>
              <Button
                onClick={onEdit}
                className="border-amber-500 bg-amber-500 text-white hover:border-amber-600 hover:bg-amber-600"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>

          {/* Project Info Section */}
          {teamDetails.project && (
            <div className="lg:w-80">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-foreground font-semibold">Current Project</h3>
                  <Badge variant="secondary">{teamDetails.project.status}</Badge>
                </div>

                <h4 className="mb-2 text-lg font-medium">{teamDetails.project.name}</h4>

                <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3" />
                  <span>Start Date: {formatDate(teamDetails.project.startDate)}</span>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                  {teamDetails.project.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{teamDetails.project.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${teamDetails.project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
