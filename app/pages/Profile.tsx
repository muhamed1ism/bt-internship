import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { useGetMyUserBuckets } from '@app/hooks/bucket';
import { UserBucketLevel } from '@app/types/bucket';
import {
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Target,
  ArrowLeft,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { Spinner } from '@app/components/ui/spinner';
import routeNames from '@app/routes/route-names';
import { UserReportsSection } from '@app/features/users/components/UserReportsSection';
import { UserReportModal } from '@app/features/users/components/modal/UserReportModal';
import { useState } from 'react';
import { useAuth } from '@app/context/AuthContext';
import { toast } from 'sonner';
import { useUpdateProfile } from '@app/hooks/user/useUpdateProfile';
import { useForm } from 'react-hook-form';
import { UpdateProfileFormValues, userSchemas } from '@app/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInputField } from '@app/components/forms/FormInputField';
import { FormDatePicker } from '@app/components/forms/FormDatePicker';
import { Form } from '@app/components/ui/form';

export const Profile = () => {
  const navigate = useNavigate();

  const { user, isLoading: userLoading, error: userError } = useAuth();
  const { userBuckets, isLoading: bucketsLoading } = useGetMyUserBuckets();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(userSchemas.updateProfile),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: new Date(user?.dateOfBirth || ''),
    },
  });

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
    setIsEditing(true);
  };

  const onSubmit = (formData: UpdateProfileFormValues) => {
    updateProfile(formData);
    if (!isPending && !error) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    form.reset();
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="h-full bg-gray-100">
        <h1 className="text-2xl">Failed to load current user</h1>
        <h4 className="text-lg">{userError?.message}</h4>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="border-border bg-card sticky top-16 z-3 w-full border-b pb-4">
            <div className="w-full px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackButton}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                  >
                    <ArrowLeft className="size-4" />
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
                      <Edit className="size-4" />
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
                        <X className="size-4" />
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2"
                      >
                        {isPending ? (
                          <>
                            <Spinner className="size-4" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="size-4" />
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

          <div className="m-4 flex flex-col gap-6 lg:m-8 lg:flex-row">
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
                  <CardDescription className="text-primary py-2">
                    <div className="grid grid-cols-1 gap-2 space-y-2 sm:grid-cols-2">
                      <div className="space-y-1">
                        {isEditing ? (
                          <FormInputField
                            control={form.control}
                            name="firstName"
                            label="First Name"
                          />
                        ) : (
                          <>
                            <Label
                              htmlFor="firstName"
                              className="text-muted-foreground text-lg font-medium"
                            >
                              First Name
                            </Label>
                            <p className="text-primary">{user.firstName}</p>
                          </>
                        )}
                      </div>
                      <div className="space-y-1">
                        {isEditing ? (
                          <FormInputField
                            control={form.control}
                            name="lastName"
                            label="Last Name"
                          />
                        ) : (
                          <>
                            <Label
                              htmlFor="lastName"
                              className="text-muted-foreground text-lg font-medium"
                            >
                              Last Name
                            </Label>
                            <p className="text-foreground">{user.lastName}</p>
                          </>
                        )}
                      </div>
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
                    <div className="bg-primary/10 self-start rounded-xl p-3 sm:self-auto">
                      <Mail className="text-primary size-4" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="w-full lg:w-1/2">
                          <FormInputField control={form.control} name="email" label="Email" />
                        </div>
                      ) : (
                        <>
                          <Label
                            htmlFor="email"
                            className="text-muted-foreground text-md font-medium"
                          >
                            Email
                          </Label>
                          <p className="text-foreground text-sm break-all">{user.email}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="bg-primary/10 self-start rounded-xl p-3 sm:self-auto">
                      <Phone className="text-primary size-4" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="w-full lg:w-1/2">
                          <FormInputField control={form.control} name="phoneNumber" label="Phone" />
                        </div>
                      ) : (
                        <>
                          <Label
                            htmlFor="phoneNumber"
                            className="text-muted-foreground text-md font-medium"
                          >
                            Phone
                          </Label>
                          <p className="text-foreground text-sm break-all">
                            {user.phoneNumber || 'Not provided'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="bg-primary/10 self-start rounded-xl p-3 sm:self-auto">
                      <Calendar className="text-primary size-4" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="w-full lg:w-1/2">
                          <FormDatePicker
                            control={form.control}
                            name="dateOfBirth"
                            label="Date of Birth"
                          />
                        </div>
                      ) : (
                        <>
                          <Label
                            htmlFor="dateOfBirth"
                            className="text-muted-foreground text-md font-medium"
                          >
                            Date of Birth
                          </Label>
                          <p className="text-foreground text-sm">
                            {new Date(user.dateOfBirth).toLocaleDateString('bs-BA')}
                          </p>
                        </>
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
                    <div className="flex h-full w-full items-center justify-center py-4">
                      <Spinner size="medium" />
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
              <div className="bg-card rounded-lg border">
                <UserReportsSection
                  userId={user.id}
                  userName={user.firstName + ' ' + user.lastName}
                  onAddReport={handleAddReport}
                  onViewAllReports={() =>
                    navigate(
                      `/reports?search=${encodeURIComponent(user.firstName + ' ' + user.lastName)}`,
                    )
                  }
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
        </form>
      </Form>
    </div>
  );
};
