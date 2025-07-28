import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { useGetReportsByUserId } from '@app/hooks/report';
import { Report } from '@app/types/types';
import { FileText, Calendar, User, Plus, ExternalLink, ChevronDown } from 'lucide-react';
import { Spinner } from '@app/components/ui/spinner';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@app/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import routeNames from '@app/routes/route-names';
import { useAuth } from '@app/context/AuthContext';
import { Alert, AlertDescription } from '@app/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface UserReportsSectionProps {
  userId: string;
  userName: string;
  onAddReport: () => void;
  onViewAllReports?: () => void;
}

export const UserReportsSection = ({
  userId,
  userName,
  onAddReport,
  onViewAllReports,
}: UserReportsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { reports, isLoading, isSuccess } = useGetReportsByUserId(userId);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // Check if current user is trying to report about themselves
  const isSelfReporting = currentUser && currentUser.id === userId;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bs-BA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReportClick = (reportId: string) => {
    navigate(routeNames.reportDetail({ reportId }));
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="border-border/50 hover:border-border transition-all duration-200">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-xl p-3">
                  <FileText className="text-primary size-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Reports</CardTitle>
                  <p className="text-muted-foreground text-sm">View reports about {userName}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                <Badge variant="outline" className="w-fit text-xs">
                  {isLoading ? '...' : reports?.length || 0} reports
                </Badge>
                {onViewAllReports && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('🔍 UserReportsSection: View All button clicked for user:', {
                        userId,
                        userName,
                      });
                      onViewAllReports();
                    }}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View All
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  {isExpanded ? (
                    <>
                      <span className="hidden lg:inline">Hide</span>
                      <ChevronDown className="h-4 w-4 rotate-180 lg:hidden" />
                    </>
                  ) : (
                    <>
                      <span className="hidden lg:inline">Show</span>
                      <ChevronDown className="h-4 w-4 lg:hidden" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="px-4 pt-0 pb-4 lg:px-6">
            {/* Add Report Button - Only show if not self-reporting */}
            {!isSelfReporting && (
              <div className="mb-4">
                <Button onClick={onAddReport} className="flex w-full items-center gap-2 sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Add Report
                </Button>
              </div>
            )}

            {/* Warning alert for self-reporting */}
            {isSelfReporting && (
              <div className="mb-4">
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    You cannot write a report about yourself.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Spinner size="medium" />
                <span className="text-muted-foreground ml-2">Loading reports...</span>
              </div>
            )}

            {!isLoading && !isSuccess && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <FileText className="text-muted-foreground/50 mx-auto h-8 w-8" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    Unable to load reports. You may not have permission to view this user's reports.
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Only admins and team leads can view user reports.
                  </p>
                </div>
              </div>
            )}

            {isSuccess && reports && reports.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <FileText className="text-muted-foreground/50 mx-auto h-8 w-8" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    No reports available for this user.
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {isSelfReporting ? '' : `Be the first to add a report about ${userName}.`}
                  </p>
                </div>
              </div>
            )}

            {isSuccess && reports && reports.length > 0 && (
              <div className="max-h-48 space-y-4 overflow-x-hidden overflow-y-auto">
                {reports
                  .sort(
                    (a: Report, b: Report) =>
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                  )
                  .map((report: Report) => (
                    <div
                      key={report.id}
                      className="bg-muted/30 hover:bg-muted/50 cursor-pointer overflow-hidden rounded-lg border p-4 transition-colors"
                      onClick={() => handleReportClick(report.id)}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-primary-foreground bg-neutral-800 text-xs font-semibold">
                              {report.author
                                ? getInitials(report.author.firstName, report.author.lastName)
                                : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {report.author
                              ? `${report.author.firstName} ${report.author.lastName}`
                              : 'Unknown Author'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="text-muted-foreground h-3 w-3" />
                          <span className="text-muted-foreground text-xs">
                            {formatDate(report.createdAt)}
                          </span>
                          <ExternalLink className="text-muted-foreground h-3 w-3" />
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-3 line-clamp-3 overflow-hidden text-sm leading-relaxed break-words">
                        {truncateText(report.content)}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

