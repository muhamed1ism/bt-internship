import { useState, useEffect } from 'react';
import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Input } from '@app/components/ui/input';
import { useGetReportsByUserId } from '@app/hooks/report';
import { Report } from '@app/types/types';
import { FileText, Calendar, User, Search } from 'lucide-react';
import { Spinner } from '@app/components/ui/spinner';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import routeNames from '@app/routes/route-names';
import { useGetUserById } from '@app/hooks/user';
import { useGetAllUsers } from '@app/hooks/user';
import { useAbility } from '@casl/react';
import { AbilityContext, Can } from '@app/casl/AbilityContext';

export const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const ability = useAbility(AbilityContext);

  if (ability.cannot('read', 'Report')) {
    return <Navigate to={routeNames.notAuthorized()} />;
  }

  // Initialize search query from URL parameter
  useEffect(() => {
    const queryFromUrl = searchParams.get('search');
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [searchParams]);

  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  // Get all users
  const { users } = useGetAllUsers();

  // Try to find a user by the search query
  const searchedUser = users?.find((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get reports for the searched user if found, otherwise get reports for all users
  const targetUserId = searchedUser?.id;
  const { reports, isLoading, isSuccess } = useGetReportsByUserId(targetUserId || '');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Component to display user information for a report
  const ReportUserInfo = ({ userId }: { userId: string }) => {
    const { user } = useGetUserById(userId);

    const getInitials = (firstName: string, lastName: string) => {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" />
          <AvatarFallback className="text-primary-foreground bg-neutral-800 text-sm font-semibold">
            {user ? getInitials(user.firstName, user.lastName) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground text-lg font-semibold">
              {user ? `${user.firstName} ${user.lastName}` : `User ${userId}`}
            </h3>
            {user && (
              <Badge variant="secondary" className={`${getStatusBadgeClass(user.status)} text-xs`}>
                {user.status}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">Report about this user</p>
        </div>
      </div>
    );
  };

  // If we have a search query but no specific user found, filter reports
  const filteredReports =
    reports?.filter((report: Report) => {
      if (!searchQuery.trim() || searchedUser) {
        return true; // If we found a user, show all their reports
      }

      const query = searchQuery.toLowerCase();

      // Use report.user if available, otherwise fall back to basic filtering
      const userName = report.user
        ? `${report.user.firstName} ${report.user.lastName}`.toLowerCase()
        : '';
      const authorName = report.author
        ? `${report.author.firstName} ${report.author.lastName}`.toLowerCase()
        : '';
      const content = report.content.toLowerCase();

      // Simple matching - check if query is found in any field
      const matches =
        userName.includes(query) ||
        authorName.includes(query) ||
        content.includes(query) ||
        report.userId.toLowerCase().includes(query);

      return matches;
    }) || [];

  const handleViewUser = (userId: string) => {
    navigate(routeNames.userDetail({ userId }));
  };

  return (
    <div className="flex h-full w-full flex-col items-center bg-gray-100 px-24 pt-12">
      {/* Header */}
      <div className="mb-8 w-full">
        <h1 className="text-foreground mb-2 text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">View and manage all reports in the system</p>
      </div>

      {/* Search and Controls */}
      <div className="mb-8 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative w-full flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search reports by user name, author, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card h-9 pl-10"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 w-full">
        <p className="text-muted-foreground text-sm">
          Showing {filteredReports.length} of {reports?.length || 0} report
          {(reports?.length || 0) !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Reports List */}
      <div className="w-full">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="large" />
            <span className="text-muted-foreground ml-2">Loading reports...</span>
          </div>
        )}

        {!isLoading && !isSuccess && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <FileText className="text-muted-foreground/50 mx-auto h-12 w-12" />
              <h3 className="text-foreground mt-4 text-lg font-medium">Unable to load reports</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                You may not have permission to view reports or there was an error loading them.
              </p>
            </div>
          </div>
        )}

        {isSuccess && filteredReports.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <FileText className="text-muted-foreground/50 mx-auto h-12 w-12" />
              <h3 className="text-foreground mt-4 text-lg font-medium">
                {searchQuery ? 'No reports found' : 'No reports available'}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {searchQuery
                  ? `No reports match your search for "${searchQuery}"`
                  : 'Start by creating your first report about a team member.'}
              </p>
            </div>
          </div>
        )}

        {isSuccess && filteredReports.length > 0 && (
          <div className="space-y-4">
            {filteredReports
              .sort(
                (a: Report, b: Report) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )
              .map((report: Report) => (
                <Card
                  key={report.id}
                  className="border-border/50 hover:border-border cursor-pointer transition-all duration-200"
                  onClick={() => navigate(routeNames.reportDetail({ reportId: report.id }))}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {/* User the report is about */}
                        <ReportUserInfo userId={report.userId} />
                      </div>

                      <div className="flex items-center gap-2">
                        <Can I="read" an="User" ability={ability}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewUser(report.userId);
                            }}
                          >
                            View User
                          </Button>
                        </Can>
                      </div>
                    </div>

                    {/* Report content */}
                    <div className="mb-4">
                      <p className="text-foreground text-muted-foreground leading-relaxed">
                        {truncateText(report.content)}
                      </p>
                    </div>

                    {/* Report metadata */}
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>
                            By{' '}
                            {report.author
                              ? `${report.author.firstName} ${report.author.lastName}`
                              : 'Unknown Author'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
