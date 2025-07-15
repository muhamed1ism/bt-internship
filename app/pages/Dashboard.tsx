import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Progress } from '@app/components/ui/progress';
import { Badge } from '@app/components/ui/badge';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@app/components/ui/chart';
import { useAuth } from '@app/context/AuthContext';
import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';
import { useGetAllTeams } from '@app/hooks/team/useGetAllTeams';
import { useGetUserReports } from '@app/hooks/report/useGetUserReports';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { users, isLoading: usersLoading } = useGetAllUsers();
  const { teams, isLoading: teamsLoading } = useGetAllTeams();
  const { reports, isLoading: reportsLoading } = useGetUserReports();

  // Redirect if not authenticated or doesn't have access
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
  } satisfies ChartConfig;

  return (
    <div className="h-full bg-gray-100 px-6 py-8">
      <div className="mx-12 mb-8 w-full">
        <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="container mx-auto h-full space-y-6">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
          {/* First Column */}
          <div className="flex h-full flex-col space-y-6">
            {/* Active Users Card */}
            {/* <Card className="h-1/6 flex-shrink-0"> */}
            {/*   <CardHeader className="pb-2"> */}
            {/*     <CardTitle className="text-lg">Active Users</CardTitle> */}
            {/*   </CardHeader> */}
            {/*   <CardContent> */}
            {/*     <div className="flex h-full items-center justify-center"> */}
            {/*       <div className="text-center"> */}
            {/*         <div className="text-primary text-3xl font-bold"> */}
            {/*           {dashboardData ? dashboardData.activeUsers : '...'} */}
            {/*         </div> */}
            {/*       </div> */}
            {/*     </div> */}
            {/*   </CardContent> */}
            {/* </Card> */}

            {/* User Registrations per Quarter Chart */}
            <Card className="h-3/6 flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">User Registrations per Quarter</CardTitle>
              </CardHeader>
              <CardContent className="h-full pb-6">
                {dashboardData ? (
                  <ChartContainer config={chartConfig} className="h-full">
                    <LineChart
                      accessibilityLayer
                      data={dashboardData.quarters}
                      margin={{
                        left: 12,
                        right: 12,
                        bottom: 25,
                        top: 5,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="quarter"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={6}
                        fontSize={12}
                        dy={-2}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Line
                        dataKey="users"
                        type="linear"
                        stroke="var(--color-users)"
                        strokeWidth={3}
                        dot={{ fill: '#000000', stroke: '#000000', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-muted-foreground">Loading data...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Status Distribution */}
            <Card className="h-2/6 flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">User Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="hide-scrollbar h-full max-h-full overflow-y-auto">
                <div className="space-y-3">
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

          {/* Second Column */}
          <div className="flex h-full flex-col space-y-6">
            {/* Team Performance */}
            <Card className="h-2/6 flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Team Performance</CardTitle>
              </CardHeader>
              <CardContent className="hide-scrollbar h-full max-h-full overflow-y-auto">
                <div className="space-y-4">
                  {dashboardData ? (
                    dashboardData.teamPerformance.slice(0, 5).map((team: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex flex-1 items-center space-x-4">
                          <span className="min-w-[120px] font-medium">{team.name}</span>
                          <div className="flex-1">
                            <Progress value={team.progress} className="h-2" />
                          </div>
                          <span className="text-muted-foreground min-w-[40px] text-right text-sm">
                            {team.progress}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground text-center">Loading...</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="h-1.5/6 flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-full space-y-2 overflow-y-auto">
                  {dashboardData ? (
                    <>
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg p-2">
                        <span className="font-medium">Total Reports</span>
                        <Badge variant="default">{dashboardData.reportCount}</Badge>
                      </div>
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg p-2">
                        <span className="font-medium">Recent (30 days)</span>
                        <Badge variant="outline" className="border-primary/30 bg-card">
                          {dashboardData.recentReports}
                        </Badge>
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
