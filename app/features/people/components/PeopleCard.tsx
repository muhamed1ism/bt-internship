import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { Button } from '@app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import routeNames from '@app/routes/route-names';
import { User } from '@app/types/types';
import { UserBucketLevel } from '@app/types/bucket';
import { useNavigate } from 'react-router-dom';
import { useGetUserBucketsById } from '@app/hooks/bucket';
import { Target } from 'lucide-react';

interface PeopleCardProps {
  user: User;
  isActive?: boolean;
  viewMode?: 'grid' | 'list';
}

export const PeopleCard = ({ user, isActive, viewMode = 'grid' }: PeopleCardProps) => {
  const navigate = useNavigate();
  const { buckets: userBuckets } = useGetUserBucketsById(user.id);

  const handleClick = () => {
    navigate(routeNames.userDetail({ userId: user.id }));
  };

  // Component to display user buckets
  const UserBucketsDisplay = ({ buckets }: { buckets: UserBucketLevel[] | undefined }) => {
    if (!buckets || buckets.length === 0) return null;

    const displayBuckets = buckets.slice(0, 3); // Show max 3 buckets

    return (
      <div className="flex flex-wrap justify-center gap-1.5">
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

  // Generate initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  if (viewMode === 'list') {
    return (
      <Card
        onClick={handleClick}
        className="group border-border/50 hover:border-border flex min-h-36 flex-row justify-between py-0 transition-all duration-200 hover:shadow-md"
      >
        <CardHeader className="flex items-center gap-4 py-6">
          {/* Profile Picture */}
          <Avatar className="m-4 size-18">
            <AvatarImage src={''} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>

          <CardContent className="flex flex-col justify-start space-y-3">
            <CardTitle className="w-full">
              <h3 className="text-foreground text-lg font-semibold">{fullName}</h3>
            </CardTitle>

            <CardDescription className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {/* Role Badge */}
                <Badge variant="secondary" className="bg-accent text-xs uppercase">
                  {user.role.name}
                </Badge>
                {/* Status Badge */}
                <Badge variant="outline" className={`${getStatusColor(user.status)} text-xs`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </div>

              {/* User Buckets */}
              <UserBucketsDisplay buckets={userBuckets} />
            </CardDescription>
          </CardContent>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => {}} size="lg" className="w-full">
            View
          </Button>
        </CardFooter>
      </Card>
    );
  } else {
    return (
      <Card
        onClick={handleClick}
        className="group border-border/50 hover:border-border flex min-h-92 cursor-pointer flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      >
        <CardHeader className="flex w-full flex-col items-center justify-center">
          {/* Profile Picture */}
          <Avatar className="mb-4 size-18">
            <AvatarImage src={''} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>

          <CardTitle className="text-center">
            <h3 className="text-foreground text-lg font-semibold">{fullName}</h3>
          </CardTitle>

          <CardDescription className="text-center">
            {/* Role Badge */}
            <Badge variant="secondary" className="bg-accent text-xs uppercase">
              {user.role.name}
            </Badge>
          </CardDescription>
          <CardContent className="space-y-2 text-center">
            {/* Status Badge */}
            <Badge variant="outline" className={`${getStatusColor(user.status)} text-xs`}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </Badge>

            {/* User Buckets */}
            <UserBucketsDisplay buckets={userBuckets} />
          </CardContent>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => {}} size="sm" className="w-full">
            View
          </Button>
        </CardFooter>
      </Card>
    );
  }
};
