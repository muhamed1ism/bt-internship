import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { UserType } from '@app/types/types';
import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';
import { useGetUserBucketsById } from '@app/hooks/bucket';
import { UserBucketLevel } from '@app/types/bucket';
import { Mail, Phone, Calendar, User, Shield, Target, ArrowLeft } from 'lucide-react';
import { Spinner } from '@app/components/ui/spinner';
import routeNames from '@app/routes/route-names';
import { UserReportsSection } from '@app/features/users/components/UserReportsSection';
import { UserReportModal } from '@app/features/users/components/modal/UserReportModal';
import { useState } from 'react';

export const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { users, isLoading } = useGetAllUsers();

  // Find the specific user
  const user = users?.find((u: UserType) => u.id === userId);

  // Get user buckets
  const { buckets: userBuckets, isLoading: bucketsLoading } = useGetUserBucketsById(userId || '');

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Generate initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleBackButton = () => {
    navigate(routeNames.people());
  };

  const handleAddReport = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
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

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">User Not Found</h2>
          <p className="mb-4 text-gray-600">The user you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/people')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to People
          </Button>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="h-full bg-gray-100">
      {/* Header */}
      <div className="border-border bg-card sticky top-16 z-10 w-full border-b pb-4">
        <div className="w-full px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackButton}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to People
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="m-8 flex gap-6">
        {/* Left Column - Basic Info & Contact */}
        <div className="w-1/3 space-y-4">
          {/* Avatar, name, status and role */}
          <Card>
            <CardHeader className="flex items-center justify-center">
              <Avatar className="my-4 size-20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="w-full">
              <CardTitle className="inline-flex items-center gap-2 text-xl">
                <User className="size-5" />
                User Information
              </CardTitle>
              <CardDescription className="py-2">
                <div className="grid grid-cols-2 gap-2 space-y-2">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-lg font-medium">First Name</p>
                    <p className="text-primary">{user.firstName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-lg font-medium">Last Name</p>
                    <p className="text-foreground">{user.lastName}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-lg font-medium">Status</p>
                  <p className="text-foreground capitalize">{user.status.toLowerCase()}</p>
                </div>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Role & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-xl">
                <Shield className="size-5" />
                {'Role & Permissions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 py-2">
              <p className="text-muted-foreground text-lg font-medium">Role</p>
              <p className="text-foreground capitalize">{user.role.name}</p>
              {user.role.description && (
                <p className="text-muted-foreground text-sm">{user.role.description}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Role & Buckets */}
        <div className="w-2/3 space-y-4">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-xl">
                <Mail className="size-5" />
                {'Contact & Additional Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-xl p-3">
                  <Mail className="text-primary size-4" />
                </div>
                <div>
                  <p className="text-muted-foreground text-md font-medium">Email</p>
                  <p className="text-foreground text-sm break-all">{user.email}</p>
                </div>
              </div>

              {user.phoneNumber && (
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-xl p-3">
                    <Phone className="text-primary size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-md font-medium">Phone</p>
                    <p className="text-foreground text-sm break-all">{user.phoneNumber}</p>
                  </div>
                </div>
              )}

              {user.dateOfBirth && (
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-xl p-3">
                    <Calendar className="text-primary size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-md font-medium">Date of Birth</p>
                    <p className="text-foreground text-sm">{formatDate(user.dateOfBirth)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Buckets */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="size-4" />
                User Buckets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bucketsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <p className="text-muted-foreground">Loading buckets...</p>
                </div>
              ) : userBuckets && userBuckets.length > 0 ? (
                <div className="grid max-h-48 grid-cols-2 gap-3 overflow-y-auto">
                  {userBuckets.map((userBucket: UserBucketLevel) => (
                    <div
                      key={userBucket.bucketLevelId}
                      className="bg-muted/30 rounded-lg border p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-foreground text-md font-medium">
                          {userBucket.bucket.category.name}
                        </h4>
                        <Badge variant="outline" className="text-sm">
                          Level {userBucket.bucket.level}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {userBucket.bucket.category.description || 'No description available'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <p className="text-muted-foreground">No buckets assigned to this user</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Reports */}
          <UserReportsSection
            userId={user.id}
            userName={fullName}
            onAddReport={handleAddReport}
            onViewAllReports={() => {
              console.log('🔍 UserDetail: View All Reports clicked for user:', {
                userId: user.id,
                userName: fullName,
                searchQuery: fullName
              });
              // Navigate with search parameter in the URL
              navigate(`/reports?search=${encodeURIComponent(fullName)}`);
            }}
          />
        </div>
      </div>

      {/* Report Modal */}
      <UserReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        user={user}
      />
    </div>
  );
};
