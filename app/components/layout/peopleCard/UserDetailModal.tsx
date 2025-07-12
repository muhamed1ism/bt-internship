import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { UserType } from '@app/types/types';
import { useGetUserBucketsById } from '@app/hooks/bucket';
import { UserBucketLevel } from '@app/types/bucket';
import { 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  Shield, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin,
  X,
  Edit,
  Eye,
  Target
} from 'lucide-react';

interface UserDetailModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  // Get user buckets
  const { buckets: userBuckets, isLoading: bucketsLoading } = useGetUserBucketsById(user.id);

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

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg flex-shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>

            {/* Basic Info */}
            <div className="flex-1 space-y-3 min-w-0">
              <div>
                <h2 className="text-3xl font-bold text-foreground break-words">{fullName}</h2>
              </div>

              <div className="flex items-center gap-3">
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(user.status)} px-3 py-1 text-sm font-medium`}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm font-medium"
                >
                  {user.role.name}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground break-all">{user.email}</p>
                  </div>
                </div>

                {user.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-foreground break-all">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {user.dateOfBirth && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p className="text-foreground">{formatDate(user.dateOfBirth)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Role</p>
                  <p className="text-foreground font-medium">{user.role.name}</p>
                  {user.role.description && (
                    <p className="text-sm text-muted-foreground mt-1">{user.role.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Buckets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                User Buckets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bucketsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <p className="text-muted-foreground">Loading buckets...</p>
                </div>
              ) : userBuckets && userBuckets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userBuckets.map((userBucket: UserBucketLevel) => (
                    <div key={userBucket.bucketLevelId} className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground h-8 flex items-center">{userBucket.bucket.category.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          Level {userBucket.bucket.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
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

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">First Name</p>
                  <p className="text-foreground">{user.firstName}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Last Name</p>
                  <p className="text-foreground">{user.lastName}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  <p className="text-foreground capitalize">{user.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal; 