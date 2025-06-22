import { Avatar, AvatarImage, AvatarFallback } from '@app/components/ui/avatar';
import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { X, Settings, Crown } from 'lucide-react';
import { TeamMemberCard } from '@app/types/member-management';

interface MemberManagementCardProps {
  member: TeamMemberCard;
  onRemove: (memberId: string) => void;
  onChangePosition: (memberId: string) => void;
  viewMode?: 'grid' | 'list';
}

export const MemberManagementCard = ({
  member,
  onRemove,
  onChangePosition,
  viewMode = 'grid',
}: MemberManagementCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'team lead':
        return 'bg-purple-100 text-purple-800';
      case 'tech lead':
        return 'bg-blue-100 text-blue-800';
      case 'frontend developer':
        return 'bg-green-100 text-green-800';
      case 'backend developer':
        return 'bg-orange-100 text-orange-800';
      case 'project manager':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="group border-border/50 hover:border-border transition-all duration-200 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                  <AvatarImage
                    src={
                      member.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`
                    }
                  />
                  <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                {member.position.isLead && (
                  <div className="absolute -top-1 -right-1 rounded-full bg-yellow-500 p-1">
                    <Crown className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-foreground truncate font-semibold">{member.name}</h3>
                  <Badge className={`text-xs ${getPositionColor(member.position.title)}`}>
                    {member.position.title}
                  </Badge>
                </div>
                <p className="text-muted-foreground truncate text-sm">{member.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  {member.projects.slice(0, 2).map((project, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {project.code}
                    </Badge>
                  ))}
                  {member.projects.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.projects.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="ml-4 flex items-center gap-2">
              <Button
                onClick={() => onChangePosition(member.id)}
                variant="outline"
                size="sm"
                className="border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
              >
                <Settings className="mr-1 h-4 w-4" />
                Change position
              </Button>
              <Button
                onClick={() => onRemove(member.id)}
                variant="outline"
                size="sm"
                className="h-8 w-8 border-red-200 p-0 hover:bg-red-50"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="group border-border/50 hover:border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-6">
        {/* Remove button */}
        <div className="mb-2 flex justify-end">
          <Button
            onClick={() => onRemove(member.id)}
            variant="outline"
            size="sm"
            className="h-6 w-6 border-red-200 p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50"
          >
            <X className="h-3 w-3 text-red-500" />
          </Button>
        </div>

        {/* Avatar */}
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
              <AvatarImage
                src={
                  member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`
                }
              />
              <AvatarFallback className="bg-gray-200 text-lg font-medium text-gray-700">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            {member.position.isLead && (
              <div className="absolute -top-1 -right-1 rounded-full bg-yellow-500 p-1.5">
                <Crown className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Member Info */}
        <div className="space-y-3 text-center">
          <div>
            <h3 className="text-foreground text-lg font-semibold">{member.name}</h3>
            <p className="text-muted-foreground text-sm">{member.email}</p>
          </div>

          {/* Position */}
          <Badge className={`${getPositionColor(member.position.title)}`}>
            {member.position.title}
          </Badge>

          {/* Projects */}
          <div className="space-y-2">
            {member.projects.map((project, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{project.name}</span>
                <Badge variant="outline" className="text-xs">
                  {project.code}
                </Badge>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-1">
            {member.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {member.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{member.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Change Position Button */}
        <div className="mt-4">
          <Button
            onClick={() => onChangePosition(member.id)}
            variant="outline"
            size="sm"
            className="w-full border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
          >
            <Settings className="mr-2 h-4 w-4" />
            Change position
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
