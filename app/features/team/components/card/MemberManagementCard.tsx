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
import { Badge } from '@app/components/ui/badge';
import { X, Settings, Crown } from 'lucide-react';
import { TeamMemberCard } from '@app/types/member-management';
import { TeamMember } from '@app/types/team';

interface MemberManagementCardProps {
  member: TeamMember;
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

  const name = member.user.firstName + ' ' + member.user.lastName;

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

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <Card className="group border-border/50 hover:border-border flex h-36 flex-row justify-between py-0 transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex items-center gap-4 py-6">
          {/* Avatar */}
          <div className="relative p-4">
            <Avatar className="size-18">
              <AvatarImage src={``} />
              <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            {member.position.toLowerCase().includes('lead') && (
              <div className="absolute top-0 right-3 rounded-full bg-yellow-500 p-1">
                <Crown className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Member Info */}
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-foreground truncate font-semibold">{name}</h3>
              <Badge className={`text-xs ${getPositionColor(member.position)}`}>
                {member.position}
              </Badge>
            </div>
            <p className="text-muted-foreground truncate text-sm">{member.user.email}</p>
            {/* <div className="mt-1 flex items-center gap-2"> */}
            {/*   {member.projects.slice(0, 2).map((project, index) => ( */}
            {/*     <Badge key={index} variant="outline" className="text-xs"> */}
            {/*       {project.code} */}
            {/*     </Badge> */}
            {/*   ))} */}
            {/*   {member.projects.length > 2 && ( */}
            {/*     <Badge variant="outline" className="text-xs"> */}
            {/*       +{member.projects.length - 2} */}
            {/*     </Badge> */}
            {/*   )} */}
            {/* </div> */}
          </div>
        </CardHeader>

        <CardFooter className="p-2">
          <div className="ml-4 flex h-full items-center gap-6">
            {/* Actions */}
            <Button
              onClick={() => onChangePosition(member.id)}
              variant="outline"
              size="sm"
              className="border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
            >
              <Settings className="mr-1 h-4 w-4" />
              Change position
            </Button>

            <div className="flex h-full items-start justify-end">
              <Button
                onClick={() => onRemove(member.id)}
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

  // GRID VIEW
  return (
    <Card className="group border-border/50 hover:border-border flex h-92 flex-col justify-between pt-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="px-2">
        {/* Remove button */}
        <div className="flex justify-end">
          <Button
            onClick={() => onRemove(member.id)}
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
            {member.position.toLowerCase().includes('lead') && (
              <div className="absolute -top-1 -right-1 rounded-full bg-yellow-500 p-1.5">
                <Crown className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>

        <CardTitle className="text-center">
          <h3 className="text-foreground text-lg font-semibold">{name}</h3>
        </CardTitle>

        <CardDescription className="text-center">
          <p className="text-muted-foreground text-sm">{member.user.email}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="mb-12 text-center">
        {/* Member Info */}
        {/* Position */}
        <Badge className={`${getPositionColor(member.position)}`}>{member.position}</Badge>

        {/* Projects */}
        {/* <div className="space-y-2"> */}
        {/*   {member.projects.map((project, index) => ( */}
        {/*     <div key={index} className="flex items-center justify-between text-sm"> */}
        {/*       <span className="text-muted-foreground">{project.name}</span> */}
        {/*       <Badge variant="outline" className="text-xs"> */}
        {/*         {project.code} */}
        {/*       </Badge> */}
        {/*     </div> */}
        {/*   ))} */}
        {/* </div> */}

        {/* Skills */}
        {/* <div className="flex flex-wrap justify-center gap-1"> */}
        {/*   {member.skills.slice(0, 3).map((skill, index) => ( */}
        {/*     <Badge key={index} variant="secondary" className="text-xs"> */}
        {/*       {skill} */}
        {/*     </Badge> */}
        {/*   ))} */}
        {/*   {member.skills.length > 3 && ( */}
        {/*     <Badge variant="secondary" className="text-xs"> */}
        {/*       +{member.skills.length - 3} */}
        {/*     </Badge> */}
        {/*   )} */}
        {/* </div> */}
      </CardContent>

      <CardFooter>
        {/* Change Position Button */}
        <Button
          onClick={() => onChangePosition(member.id)}
          variant="outline"
          size="sm"
          className="w-full border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
        >
          <Settings className="mr-2 h-4 w-4" />
          Change position
        </Button>
      </CardFooter>
    </Card>
  );
};
