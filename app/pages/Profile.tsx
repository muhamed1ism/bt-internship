import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '@app/components/ui/alert';
import { UserType } from '@app/types/types';
import { useGetUserBucketsById } from '@app/hooks/bucket';
import { UserBucketLevel } from '@app/types/bucket';
import { Mail, Phone, Calendar, User, Shield, Target, ArrowLeft, Edit, Save, X, AlertTriangle } from 'lucide-react';
import { Spinner } from '@app/components/ui/spinner';
import routeNames from '@app/routes/route-names';
import { UserReportsSection } from '@app/features/users/components/UserReportsSection';
import { UserReportModal } from '@app/features/users/components/modal/UserReportModal';
import { useState } from 'react';
import { useAuth } from '@app/context/AuthContext';
import { updateUserProfileApi } from '@app/api/user-api';
import { toast } from 'sonner';

export const Profile = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // Get user buckets
  const { buckets: userBuckets, isLoading: bucketsLoading } = useGetUserBucketsById(currentUser?.id || '');

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: ''
  });

  // Validation error state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showValidationError, setShowValidationError] = useState(false);

  // Generate initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleBackButton = () => {
    navigate(routeNames.dashboard());
  };

  const handleAddReport = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleEditClick = () => {
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      dateOfBirth: user.dateOfBirth || ''
    });
    setIsEditing(true);
    // Clear any validation errors when starting to edit
    setValidationError(null);
    setShowValidationError(false);
  };

  const handleSaveClick = async () => {
    // Clear any previous validation errors
    setValidationError(null);
    setShowValidationError(false);

    // Basic validation
    if (!editedUser.firstName.trim() || !editedUser.lastName.trim() || !editedUser.email.trim()) {
      setValidationError('First name, last name, and email are required fields.');
      setShowValidationError(true);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedUser.email)) {
      setValidationError('Please enter a valid email address.');
      setShowValidationError(true);
      return;
    }
    
    // Additional email validation - check for common typos
    const emailParts = editedUser.email.split('@');
    if (emailParts.length !== 2) {
      setValidationError('Please enter a valid email address.');
      setShowValidationError(true);
      return;
    }
    
    const domain = emailParts[1];
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const similarDomains = ['gmail.come', 'yahoo.come', 'hotmail.come', 'outlook.come'];
    
    if (similarDomains.includes(domain)) {
      const correctedDomain = domain.replace('.come', '.com');
      setValidationError(`Did you mean ${emailParts[0]}@${correctedDomain}?`);
      setShowValidationError(true);
      return;
    }

    // Phone number validation (E.164 format: +[country code][number])
    if (editedUser.phoneNumber.trim()) {
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(editedUser.phoneNumber.trim())) {
        setValidationError('Phone number must be in international format (E.164). Example: +1234567890');
        setShowValidationError(true);
        return;
      }
    }

    // Date validation - only validate if user actually entered a new date
    if (editedUser.dateOfBirth && editedUser.dateOfBirth !== (user.dateOfBirth || '')) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(editedUser.dateOfBirth)) {
        setValidationError('Date of birth must be in YYYY-MM-DD format.');
        setShowValidationError(true);
        return;
      }
      
      // Check if date is valid
      const date = new Date(editedUser.dateOfBirth);
      if (isNaN(date.getTime())) {
        setValidationError('Please enter a valid date of birth.');
        setShowValidationError(true);
        return;
      }
      
      // Check if date is not in the future
      if (date > new Date()) {
        setValidationError('Date of birth cannot be in the future.');
        setShowValidationError(true);
        return;
      }
    }

    setIsSaving(true);
    try {
      // Build update payload - always include all fields with current values
      const updatePayload: any = {
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        email: editedUser.email.trim()
      };
      
      // Always include phoneNumber - use edited value or original value
      if (editedUser.phoneNumber.trim()) {
        updatePayload.phoneNumber = editedUser.phoneNumber.trim();
      } else if (user.phoneNumber) {
        updatePayload.phoneNumber = user.phoneNumber;
      } else {
        updatePayload.phoneNumber = null;
      }
      
      // Always include dateOfBirth - use edited value or original value
      if (editedUser.dateOfBirth) {
        const date = new Date(editedUser.dateOfBirth);
        updatePayload.dateOfBirth = date.toISOString();
      } else if (user.dateOfBirth) {
        // Convert original date to ISO format if it exists
        const originalDate = new Date(user.dateOfBirth);
        updatePayload.dateOfBirth = originalDate.toISOString();
      } else {
        updatePayload.dateOfBirth = null;
      }

      console.log('Original user data:', {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth
      });
      console.log('Edited user data:', editedUser);
      console.log('Email comparison:', {
        original: user.email,
        edited: editedUser.email,
        areEqual: editedUser.email === user.email,
        editedTrimmed: editedUser.email.trim(),
        originalTrimmed: user.email.trim(),
        areEqualTrimmed: editedUser.email.trim() === user.email.trim()
      });
      console.log('Sending update payload:', updatePayload);
      console.log('Email being sent:', updatePayload.email);
      console.log('Email validation check:', updatePayload.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatePayload.email) : 'No email in payload');

      // Use the proper API function
      const updatedUser = await updateUserProfileApi(updatePayload);
      
      // Update the local user object with the response
      Object.assign(user, updatedUser);
      
      // Also update the auth context if needed
      // You might want to update the currentUser in AuthContext here
      
      setIsEditing(false);
      
      // Clear validation errors on success
      setValidationError(null);
      setShowValidationError(false);
      
      // Show success message
      toast.success('Profile updated successfully');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Show error message to user using the alert system
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setValidationError(errorMessage);
      setShowValidationError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Clear validation errors when canceling
    setValidationError(null);
    setShowValidationError(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
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

  if (!currentUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Not Authenticated</h2>
          <p className="mb-4 text-gray-600">Please log in to view your profile.</p>
          <Button onClick={() => navigate(routeNames.login())}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Convert currentUser to UserType format for compatibility
  const user: UserType = {
    id: currentUser.id,
    email: currentUser.email,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    phoneNumber: currentUser.phoneNumber,
    dateOfBirth: currentUser.dateOfBirth ? (typeof currentUser.dateOfBirth === 'string' ? currentUser.dateOfBirth : currentUser.dateOfBirth.toISOString()) : undefined,
    status: 'active', // Assuming current user is always active
    role: {
      id: currentUser.roleId,
      name: 'User', // This would need to be fetched from the API
      description: 'Standard user role'
    }
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="h-full bg-gray-100">
      {/* Header */}
      <div className="border-border bg-card sticky top-16 z-10 w-full border-b pb-4">
        <div className="w-full px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackButton}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelClick}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveClick}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Alert */}
      {showValidationError && validationError && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
          <Alert className="border-yellow-200 bg-yellow-50 shadow-lg animate-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {validationError}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="m-4 flex flex-col gap-6 lg:flex-row lg:m-8">
        {/* Left Column - Basic Info & Contact */}
        <div className="w-full space-y-4 lg:w-1/3">
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
                <div className="grid grid-cols-1 gap-2 space-y-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-muted-foreground text-lg font-medium">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editedUser.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="text-primary"
                      />
                    ) : (
                      <p className="text-primary">{user.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-muted-foreground text-lg font-medium">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editedUser.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="text-foreground"
                      />
                    ) : (
                      <p className="text-foreground">{user.lastName}</p>
                    )}
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
        <div className="w-full space-y-4 lg:w-2/3">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-xl">
                <Mail className="size-5" />
                {'Contact & Additional Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="bg-primary/10 rounded-xl p-3 self-start sm:self-auto">
                  <Mail className="text-primary size-4" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="email" className="text-muted-foreground text-md font-medium">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="text-foreground text-sm break-all"
                    />
                  ) : (
                    <p className="text-foreground text-sm break-all">{user.email}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="bg-primary/10 rounded-xl p-3 self-start sm:self-auto">
                  <Phone className="text-primary size-4" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="phoneNumber" className="text-muted-foreground text-md font-medium">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={editedUser.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="+1234567890 (E.164 format)"
                      className="text-foreground text-sm break-all"
                    />
                  ) : (
                    <p className="text-foreground text-sm break-all">{user.phoneNumber || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="bg-primary/10 rounded-xl p-3 self-start sm:self-auto">
                  <Calendar className="text-primary size-4" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="dateOfBirth" className="text-muted-foreground text-md font-medium">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editedUser.dateOfBirth ? editedUser.dateOfBirth.split('T')[0] : ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="text-foreground text-sm"
                    />
                  ) : (
                    <p className="text-foreground text-sm">{user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not provided'}</p>
                  )}
                </div>
              </div>
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
                <div className="grid max-h-48 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
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
          <div className="rounded-lg border bg-card">
            <UserReportsSection
              userId={user.id}
              userName={fullName}
              onAddReport={handleAddReport}
              onViewAllReports={() => {
                console.log('🔍 Profile: View All Reports clicked for user:', {
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