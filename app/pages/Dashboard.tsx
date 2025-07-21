import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Progress } from '@app/components/ui/progress';
import { Badge } from '@app/components/ui/badge';
import { Button } from '@app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Bar, BarChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@app/components/ui/chart';
import { useAuth } from '@app/context/AuthContext';
import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';
import { useGetAllTeams } from '@app/hooks/team/useGetAllTeams';
import { useGetAllReports } from '@app/hooks/report/useGetAllReports';
import { useGetUserById } from '@app/hooks/user/useGetUserById';
import { useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserDashboard } from './UserDashboard';
import { TicketStatus } from '@app/types/ticket';
import { useTicketAnalytics } from '@app/hooks/ticket/useTicketAnalytics';
import { User, Calendar } from 'lucide-react';
import routeNames from '@app/routes/route-names';

export const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { users, isLoading: usersLoading } = useGetAllUsers();
  const { teams, isLoading: teamsLoading } = useGetAllTeams();
  const { reports, isLoading: reportsLoading } = useGetAllReports();
  const navigate = useNavigate();
  
  // Use the actual ticket analytics hook
  const { overview, trends, performance, recentTickets, employeePerformance, isLoading: ticketsLoading } = useTicketAnalytics();

  // Helper functions for reports
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Component to display user information for a report (scaled down version)
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
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src="" />
          <AvatarFallback className="text-primary-foreground bg-neutral-800 text-xs font-semibold">
            {user ? getInitials(user.firstName, user.lastName) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1">
            <h4 className="text-foreground text-sm font-medium">
              {user ? `${user.firstName} ${user.lastName}` : `User ${userId}`}
            </h4>
            {user && (
              <Badge variant="secondary" className={`${getStatusBadgeClass(user.status)} text-xs px-1 py-0`}>
                {user.status}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Redirect if not authenticated or doesn't have access
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role?.name === 'user') {
    return <UserDashboard />;
  }

  // Calculate real data from backend
  const dashboardData = useMemo(() => {
    if (!users || !teams || !reports) return null;

    // User status counts
    const activeUsers = users.filter((u: any) => u.status === 'ACTIVE').length;
    const pendingUsers = users.filter((u: any) => u.status === 'PENDING').length;
    const inactiveUsers = users.filter((u: any) => u.status === 'INACTIVE').length;

    // Team status distribution
    const teamStatusCounts = teams.reduce(
      (acc: any, team: any) => {
        acc[team.status] = (acc[team.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // User registration trends (last 4 quarters)
    const now = new Date();
    const quarters = [];
    for (let i = 3; i >= 0; i--) {
      const quarterStart = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3 - i * 3,
        1,
      );
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
      const quarterUsers = users.filter((user: any) => {
        const userDate = new Date(user.createdAt || '');
        return userDate >= quarterStart && userDate <= quarterEnd;
      }).length;
      quarters.push({ quarter: `Q${4 - i}`, users: quarterUsers });
    }

    // Team performance (based on member count and status)
    const teamPerformance = teams
      .map((team: any) => ({
        name: team.name,
        progress:
          team.status === 'COMPLETED'
            ? 100
            : team.status === 'IN_PROGRESS'
              ? 75
              : team.status === 'PLANNING'
                ? 25
                : 10,
        memberCount: team.members?.length || 0,
      }))
      .sort((a: any, b: any) => b.progress - a.progress);

    // Report activity
    const reportCount = reports.length;
    const recentReports = reports.filter((report: any) => {
      const reportDate = new Date(report.createdAt || '');
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return reportDate >= thirtyDaysAgo;
    }).length;

    return {
      activeUsers,
      pendingUsers,
      inactiveUsers,
      teamStatusCounts,
      quarters,
      teamPerformance,
      reportCount,
      recentReports,
    };
  }, [users, teams, reports]);

  const chartConfig = {
    users: {
      label: 'User Registrations',
      color: '#000000',
    },
    tickets: {
      label: 'Tickets',
      color: '#3b82f6',
    },
  } satisfies ChartConfig;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 overflow-x-hidden">
      <div className="mx-12 mb-8 w-full">
        <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="container mx-auto h-full space-y-6">
        {/* Ticket Overview Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{overview.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Finished</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{overview.finished}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
          {/* First Column */}
          <div className="flex h-full flex-col space-y-6">
            {/* Ticket Trends Chart */}
            <Card className="h-[400px] flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Ticket Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px] pb-4 overflow-hidden flex items-center justify-center">
                {trends.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <LineChart
                      accessibilityLayer
                      data={trends}
                      width={600}
                      height={320}
                      margin={{
                        left: 12,
                        right: 12,
                        bottom: 20,
                        top: 5,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={6}
                        fontSize={12}
                        dy={-2}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={6}
                        fontSize={12}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Line
                        dataKey="count"
                        type="linear"
                        stroke="var(--color-tickets)"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-muted-foreground">No ticket data available</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="h-2/6 flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="hide-scrollbar h-full max-h-full overflow-y-auto">
                <div className="space-y-3">
                  <div className="bg-muted/50 flex items-center justify-between rounded-lg p-2">
                    <span className="font-medium">Avg Resolution Time</span>
                    <Badge variant="default">{performance.avgResolutionTime}</Badge>
                  </div>
                  <div className="bg-muted/50 flex items-center justify-between rounded-lg p-2">
                    <span className="font-medium">Avg Response Time</span>
                    <Badge variant="outline" className="border-primary/30 bg-card">
                      {performance.avgResponseTime}
                    </Badge>
                  </div>
                  <div className="bg-muted/50 flex items-center justify-between rounded-lg p-2">
                    <span className="font-medium">Resolution Rate</span>
                    <Badge variant="default">{overview.resolutionRate}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Column */}
          <div className="flex h-full flex-col space-y-6">
            {/* Recent Tickets */}
            <Card className="h-2/6 flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Recent Tickets</CardTitle>
              </CardHeader>
              <CardContent className="hide-scrollbar h-full max-h-full overflow-y-auto">
                <div className="space-y-3">
                  {recentTickets.length > 0 ? (
                    recentTickets.slice(0, 5).map((ticket: any) => (
                      <div key={ticket.id} className="bg-muted/50 flex items-center justify-between rounded-lg p-2">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{ticket.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {ticket.employee.firstName} {ticket.employee.lastName}
                          </span>
                        </div>
                        <Badge 
                          variant={
                            ticket.status === 'FINISHED' ? 'default' :
                            ticket.status === 'ONGOING' ? 'outline' :
                            ticket.status === 'AWAITING_CONFIRMATION' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground text-center">No recent tickets</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="h-2/6 flex-shrink-0">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Recent Reports</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/reports')}
                    className="text-xs"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="hide-scrollbar h-full max-h-full overflow-y-auto">
                <div className="space-y-3">
                  {reports && reports.length > 0 ? (
                    reports
                      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 3)
                      .map((report: any) => (
                        <Card
                          key={report.id}
                          className="border-border/50 hover:border-border cursor-pointer transition-all duration-200"
                          onClick={() => navigate(routeNames.reportDetail({ reportId: report.id }))}
                        >
                          <CardContent className="p-3">
                            <div className="mb-2 flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <ReportUserInfo userId={report.userId} />
                              </div>
                            </div>

                            {/* Report content */}
                            <div className="mb-2">
                              <p className="text-muted-foreground text-xs leading-relaxed">
                                {truncateText(report.content)}
                              </p>
                            </div>

                            {/* Report metadata */}
                            <div className="text-muted-foreground flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>
                                    {report.author
                                      ? `${report.author.firstName} ${report.author.lastName}`
                                      : 'Unknown Author'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(report.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <div className="text-muted-foreground text-center">No recent reports</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Status Distribution */}
            <Card className="h-1.5/6 flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">User Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-full space-y-2 overflow-y-auto">
                  {dashboardData ? (
                    <>
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg p-2">
                        <span className="font-medium">Active Users</span>
                        <Badge variant="default">{dashboardData.activeUsers}</Badge>
                      </div>
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg p-2">
                        <span className="font-medium">Pending Users</span>
                        <Badge variant="outline" className="border-primary/30 bg-card">
                          {dashboardData.pendingUsers}
                        </Badge>
                      </div>
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg p-2">
                        <span className="font-medium">Inactive Users</span>
                        <Badge variant="destructive">{dashboardData.inactiveUsers}</Badge>
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground text-center">Loading...</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
