import { Card, CardContent, CardFooter, CardHeader } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { FileText, UserCog, Mail, Calendar, Target } from 'lucide-react';
import { MemberCardProps } from '@app/types/team';
import { useAuth } from '@app/context/AuthContext';
import { useGetUserBucketsById } from '@app/hooks/bucket';
import { UserBucketLevel } from '@app/types/bucket';

export const MemberCard = ({
  member,
  onSubmitReport,
  onChangePosition,
  viewMode = 'grid',
}: MemberCardProps) => {
  const { buckets: userBuckets } = useGetUserBucketsById(member.user.id);
  const { user: currentUser } = useAuth();

  // Check if current user is trying to report about themselves
  const isSelfReporting = currentUser && currentUser.id === member.user.id;

  // Generate initials for avatars
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Component to display user buckets
  const UserBucketsDisplay = ({ buckets }: { buckets: UserBucketLevel[] | undefined }) => {
    if (!buckets || buckets.length === 0) return null;

    const displayBuckets = buckets.slice(0, 3); // Show max 3 buckets

    return (
      <div className="flex flex-wrap gap-1.5">
        {displayBuckets.map((userBucket) => (
          <div
            key={userBucket.bucketLevelId}
            className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs"
          >
            <Target className="text-muted-foreground h-3 w-3" />
            <span className="text-muted-foreground font-medium">
              {userBucket.bucket.category.name}
            </span>
            <Badge variant="secondary" className="h-4 px-1 py-0 text-xs">
              {userBucket.bucket.level}
            </Badge>
          </div>
        ))}
        {buckets.length > 3 && (
          <div className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs">
            <span className="text-muted-foreground">+{buckets.length - 3}</span>
          </div>
        )}
      </div>
    );
  };

  const positionBadgeClass =
    member.position.toLowerCase() === 'team lead'
      ? 'bg-purple-100 text-purple-800'
      : member.position.toLowerCase() === 'tech lead'
        ? 'bg-blue-100 text-blue-800'
        : member.position.toLowerCase() === 'frontend developer'
          ? 'bg-green-100 text-green-800'
          : member.position.toLowerCase() === 'backend developer'
            ? 'bg-orange-100 text-orange-800'
            : member.position.toLowerCase() === 'project manager'
              ? 'bg-pink-100 text-pink-800'
              : 'bg-gray-100 text-gray-800';

  const statusBadgeClass =
    member.user.status.toLowerCase() === 'active'
      ? 'bg-blue-400 text-white'
      : member.user.status.toLowerCase() === 'inactive'
        ? 'bg-red-400 text-white'
        : member.user.status.toLowerCase() === 'pending'
          ? 'bg-yellow-400 text-black'
          : 'bg-gray-500 text-white';

  return (
    <Card
      className={
        viewMode === 'list'
          ? 'flex flex-row gap-0'
          : '' +
            'group border-border/50 hover:border-border relative gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'
      }
    >
      <CardHeader className="flex min-w-2/5 items-center gap-4">
        <div className="flex flex-row">
          {/* Member Avatar and Basic Info */}
          <Avatar className="mr-4 size-18">
            <AvatarImage src={``} />
            <AvatarFallback className="text-primary-foreground bg-neutral-800 text-lg font-semibold">
              {getInitials(member.user.firstName, member.user.lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="text-foreground mb-1 truncate text-lg font-bold">
              {member.user.firstName} {member.user.lastName}
            </h3>
            <p className="text-muted-foreground mb-2 flex items-center gap-1 text-sm">
              <Mail className="h-3 w-3" />
              {member.user.email}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`${statusBadgeClass} px-2 py-1 text-xs`}>
                {member.user.status}
              </Badge>
              {member.position && (
                <Badge
                  variant="outline"
                  className={`${positionBadgeClass} border-primary/30 px-2 py-1 text-xs`}
                >
                  {member.position}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow">
        {/* Position Details */}
        <div className="space-y-3">
          {/* Join Date */}
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3" />
            <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
          </div>

          {/* User Buckets */}
          <div className="space-y-2">
            <div className="flex h-16 items-start">
              <UserBucketsDisplay buckets={userBuckets} />
            </div>
          </div>

          {/* Skills */}
          {/* <div className="mb-4"> */}
          {/*   <p className="text-muted-foreground mb-2 text-sm font-medium">Skills</p> */}
          {/*   <div className="flex flex-wrap gap-1"> */}
          {/*     {member.skills.slice(0, 3).map((skill, index) => ( */}
          {/*       <Badge key={index} variant="outline" className="text-xs"> */}
          {/*         {skill} */}
          {/*       </Badge> */}
          {/*     ))} */}
          {/*     {member.skills.length > 3 && ( */}
          {/*       <Badge variant="outline" className="text-muted-foreground text-xs"> */}
          {/*         +{member.skills.length - 3} */}
          {/*       </Badge> */}
          {/*     )} */}
          {/*   </div> */}
          {/* </div> */}
        </div>
      </CardContent>

      <CardFooter className="min-w-50">
        <div className="grid w-full grid-cols-1 gap-3">
          <Button
            onClick={() => onSubmitReport?.(member.id)}
            variant="outline"
            size="sm"
            className="border-primary/30 hover:border-primary/50 flex-1 transition-colors"
            disabled={isSelfReporting || false}
            title={isSelfReporting ? "You cannot write a report about yourself" : "Submit a report about this team member"}
          >
            <FileText className="mr-1 size-4" />
            Submit Report
          </Button>
          <Button
            onClick={() => onChangePosition?.(member.id)}
            size="sm"
            className="border-yellow-600 bg-yellow-400 text-black hover:border-yellow-700 hover:bg-yellow-500"
          >
            <UserCog className="mr-1 size-4" />
            Change Position
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
