import { Card, CardContent, CardFooter } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { FileText, UserCog, Mail, Calendar } from 'lucide-react';
import { MemberCardProps } from '@app/types/team-member';

export const MemberCard = ({ member, onSubmitReport, onChangePosition }: MemberCardProps) => {
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
    <Card className="group border-border/50 hover:border-border relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-6">
        {/* Member Avatar and Basic Info */}
        <div className="mb-4 flex items-start gap-4">
          <Avatar className="border-background h-16 w-16 border-2 shadow-md">
            <AvatarImage
              src={
                member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`
              }
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h3 className="text-foreground mb-1 truncate text-lg font-bold">{member.name}</h3>
            <p className="text-muted-foreground mb-2 flex items-center gap-1 text-sm">
              <Mail className="h-3 w-3" />
              {member.email}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={`${member.status.color} px-2 py-1 text-xs text-white`}
              >
                {member.status.label}
              </Badge>
              {member.position.isLead && (
                <Badge variant="outline" className="text-xs">
                  Lead
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Position Details */}
        <div className="mb-4 space-y-3">
          <div>
            <h4 className="text-foreground text-base font-semibold">{member.position.title}</h4>
            <p className="text-muted-foreground text-sm">
              {member.position.level} • {member.position.department}
            </p>
          </div>

          {/* Join Date */}
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3" />
            <span>Joined {formatDate(member.joinDate)}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-muted-foreground mb-2 text-sm font-medium">Skills</p>
          <div className="flex flex-wrap gap-1">
            {member.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {member.skills.length > 3 && (
              <Badge variant="outline" className="text-muted-foreground text-xs">
                +{member.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pt-0 pb-6">
        <div className="flex w-full gap-3">
          <Button
            onClick={() => onSubmitReport?.(member.id)}
            variant="outline"
            size="sm"
            className="group-hover:border-primary/50 flex-1 transition-colors"
          >
            <FileText className="mr-1 h-4 w-4" />
            Submit Report
          </Button>
          <Button
            onClick={() => onChangePosition?.(member.id)}
            size="sm"
            className="flex-1 border-amber-500 bg-amber-500 text-white hover:border-amber-600 hover:bg-amber-600"
          >
            <UserCog className="mr-1 h-4 w-4" />
            Change Position
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
