import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useGetReportById, useGetAuthorReports } from '@app/hooks/report';
import { Report } from '@app/types/types';
import { Mail, Calendar, User, ArrowLeft, FileText, Edit, Trash2 } from 'lucide-react';
import { Spinner } from '@app/components/ui/spinner';
import routeNames from '@app/routes/route-names';
import { useState } from 'react';
import { useDeleteReport } from '@app/hooks/report';
import { useGetAllUsers } from '@app/hooks/user';
import { toast } from 'sonner';
import { useAuth } from '@app/context/AuthContext';

export const ReportDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { report, isLoading, isSuccess, error } = useGetReportById(reportId || '');
  const { mutate: deleteReport } = useDeleteReport();
  const [isDeleting, setIsDeleting] = useState(false);
  const { user: currentUser } = useAuth();



  // Get all users to find the report user
  const { users, isLoading: usersLoading } = useGetAllUsers();
  const reportUser = users?.find(u => u.id === report?.userId);
  
  // Debug: Get all author reports to see what's available
  const { reports: authorReports } = useGetAuthorReports();
  
  console.log('🔍 ReportDetail Debug:', {
    reportId,
    report,
    reportUserId: report?.userId,
    usersCount: users?.length,
    usersLoading,
    reportUser,
    foundUser: !!reportUser,
    reportType: typeof report,
    isArray: Array.isArray(report),
    reportLength: Array.isArray(report) ? report.length : 'N/A',
    authorReportsCount: authorReports?.length,
    availableReportIds: authorReports?.map((r: Report) => r.id),
    reportExists: authorReports?.some((r: Report) => r.id === reportId),
    authorReports: authorReports
  });

  // Check if current user is the author of the report
  const isAuthor = currentUser && report && currentUser.id === report.authorId;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-blue-400 text-white';
      case 'inactive':
        return 'bg-red-400 text-white';
      case 'pending':
        return 'bg-yellow-400 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleBackButton = () => {
    navigate(routeNames.reports());
  };

  const handleViewUser = (userId: string) => {
    navigate(routeNames.userDetail({ userId }));
  };

  const handleEditReport = () => {
    // TODO: Implement edit functionality
    toast.info('Edit functionality coming soon');
  };

  const handleDeleteReport = () => {
    if (!report) return;

    setIsDeleting(true);
    deleteReport(report.id, {
      onSuccess: () => {
        toast.success('Report deleted successfully');
        navigate(routeNames.reports());
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete report');
      },
      onSettled: () => {
        setIsDeleting(false);
      },
    });
  };

  console.log('🔄 ReportDetail Loading States:', { isLoading, usersLoading });
  
  if (isLoading || usersLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Report Not Found</h2>
          <p className="mb-4 text-gray-600">
            {error ? `Error: ${error.message}` : 'The report you\'re looking for doesn\'t exist or you don\'t have permission to view it.'}
          </p>
          <Button onClick={handleBackButton}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  console.log('👤 ReportDetail User Display:', { 
    reportUser, 
    displayName: reportUser ? `${reportUser.firstName} ${reportUser.lastName}` : `User ${report.userId}`,
    userId: report.userId 
  });

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
                Back to Reports
              </Button>
            </div>
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditReport}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteReport}
                  disabled={isDeleting}
                  className="flex items-center gap-2"
                >
                  {isDeleting ? (
                    <Spinner size="small" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="m-8 flex gap-6">
        {/* Left Column - Report Content */}
        <div className="w-2/3 space-y-4">
          {/* Report Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5" />
                Report Content
              </CardTitle>
              <CardDescription>
                Detailed feedback and evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {report.content}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Report Details */}
        <div className="w-1/3 space-y-4">
          {/* Report Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{formatDate(report.createdAt)}</span>
              </div>
              {report.updatedAt !== report.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <span className="text-sm font-medium">{formatDate(report.updatedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5" />
                Report Author
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.author ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-primary-foreground bg-neutral-800 text-lg font-semibold">
                      {getInitials(report.author.firstName, report.author.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-foreground text-lg font-semibold">
                      {report.author.firstName} {report.author.lastName}
                    </h3>
                    <p className="text-muted-foreground text-sm">{report.author.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Unknown Author</p>
              )}
            </CardContent>
          </Card>

          {/* User the report is about */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5" />
                Report About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-primary-foreground bg-neutral-800 text-lg font-semibold">
                        {reportUser ? getInitials(reportUser.firstName, reportUser.lastName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-foreground text-lg font-semibold">
                        {reportUser ? `${reportUser.firstName} ${reportUser.lastName}` : `User ${report.userId}`}
                      </h3>
                      {reportUser ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={`${getStatusBadgeClass(reportUser.status)} text-xs`}
                          >
                            {reportUser.status}
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="bg-gray-500 text-white text-xs"
                          >
                            User not found
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                
                {reportUser ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="text-sm font-medium">{reportUser.email}</span>
                    </div>
                    {reportUser.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Phone</span>
                        <span className="text-sm font-medium">{reportUser.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="text-sm font-medium text-muted-foreground">Not available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="text-sm font-medium text-muted-foreground">Not available</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleViewUser(report.userId)}
                  className="w-full"
                  variant="outline"
                >
                  View User Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 