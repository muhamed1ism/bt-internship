import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { UserType } from '@app/types/types';
import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';
import { useGetUserBucketsById } from '@app/hooks/bucket';
import { UserBucketLevel } from '@app/types/bucket';
import { 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  Shield, 
  Target,
  ArrowLeft
} from 'lucide-react';

export const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { users, isLoading } = useGetAllUsers();
  
  // Find the specific user
  const user = users?.find((u: UserType) => u.id === userId);

  // Get user buckets
  const { buckets: userBuckets, isLoading: bucketsLoading } = useGetUserBucketsById(userId || '');

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

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/people')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to People
          </Button>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/people')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to People
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        </div>

        <div className="flex gap-6">
          {/* Left Column - Basic Info & Contact */}
          <div className="w-1/3 space-y-4">
            {/* Header Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground break-words">{fullName}</h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(user.status)} px-2 py-1 text-xs font-medium`}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="bg-primary/10 text-primary border-primary/20 px-2 py-1 text-xs font-medium"
                      >
                        {user.role.name}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground break-all">{user.email}</p>
                  </div>
                </div>

                {user.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm text-foreground break-all">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {user.dateOfBirth && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground">Date of Birth</p>
                      <p className="text-sm text-foreground">{formatDate(user.dateOfBirth)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-4 w-4" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">First Name</p>
                    <p className="text-sm text-foreground">{user.firstName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Last Name</p>
                    <p className="text-sm text-foreground">{user.lastName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <p className="text-sm text-foreground capitalize">{user.status}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Role & Buckets */}
          <div className="w-2/3 space-y-4">
            {/* Role & Permissions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-4 w-4" />
                  Role & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Role</p>
                  <p className="text-foreground font-medium">{user.role.name}</p>
                  {user.role.description && (
                    <p className="text-sm text-muted-foreground mt-1">{user.role.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Buckets */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-4 w-4" />
                  User Buckets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bucketsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <p className="text-muted-foreground">Loading buckets...</p>
                  </div>
                ) : userBuckets && userBuckets.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {userBuckets.map((userBucket: UserBucketLevel) => (
                      <div key={userBucket.bucketLevelId} className="border rounded-lg p-3 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground text-sm">{userBucket.bucket.category.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            Level {userBucket.bucket.level}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
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
          </div>
        </div>
      </div>
    </div>
  );
}; 