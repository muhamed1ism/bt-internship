import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Progress } from '@app/components/ui/progress';
import { Badge } from '@app/components/ui/badge';
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@app/components/ui/chart';

// Mock data
const promotionData = [
  { quarter: 'Q1', promotions: 12 },
  { quarter: 'Q2', promotions: 18 },
  { quarter: 'Q3', promotions: 15 },
  { quarter: 'Q4', promotions: 22 },
];

const chartConfig = {
  promotions: {
    label: "Promotions",
    color: "#000000",
  },
} satisfies ChartConfig;

const averageTimeData = [
  { from: 'Dev1', to: 'Dev2', time: '8.5 months' },
  { from: 'Dev2', to: 'Dev3', time: '12.3 months' },
  { from: 'Dev3', to: 'Dev4', time: '15.7 months' },
  { from: 'QA1', to: 'QA2', time: '6.2 months' },
  { from: 'QA2', to: 'QA3', time: '9.8 months' },
  { from: 'Design1', to: 'Design2', time: '11.4 months' },
  { from: 'Design2', to: 'Design3', time: '14.1 months' },
  { from: 'PM1', to: 'PM2', time: '13.6 months' },
];

const teamLeaderboard = [
  { name: 'Frontend Team', progress: 85, position: 1 },
  { name: 'Backend Team', progress: 72, position: 2 },
  { name: 'QA Team', progress: 68, position: 3 },
  { name: 'Design Team', progress: 65, position: 4 },
  { name: 'DevOps Team', progress: 58, position: 5 },
  { name: 'Mobile Team', progress: 52, position: 6 },
  { name: 'Data Team', progress: 45, position: 7 },
  { name: 'Security Team', progress: 38, position: 8 },
];

const skillsData = [
  { skill: 'Angular', level: 3, time: '1.2Y' },
  { skill: 'React', level: 4, time: '2.1Y' },
  { skill: 'Node.js', level: 3, time: '1.8Y' },
  { skill: 'Python', level: 2, time: '0.9Y' },
  { skill: 'Java', level: 3, time: '1.5Y' },
  { skill: 'AWS', level: 2, time: '1.1Y' },
  { skill: 'Docker', level: 3, time: '1.3Y' },
  { skill: 'Kubernetes', level: 2, time: '0.8Y' },
  { skill: 'TypeScript', level: 4, time: '2.3Y' },
  { skill: 'GraphQL', level: 2, time: '1.0Y' },
];

const missingPositions = [
  { position: 'Senior Frontend Developer', count: 2 },
  { position: 'DevOps Engineer', count: 1 },
  { position: 'QA Lead', count: 1 },
  { position: 'Product Manager', count: 1 },
  { position: 'UX Designer', count: 2 },
];

export const Dashboard = () => {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-100 p-6 overflow-hidden">
      <div className="container mx-auto space-y-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* First Column */}
        <div className="space-y-6 h-full flex flex-col">
          {/* Pending Promotions Card */}
          <Card className="h-1/6 flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">6</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promotions per Quarter Chart */}
          <Card className="h-2/6 flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Promotions per Quarter</CardTitle>
            </CardHeader>
            <CardContent className="h-full pb-6">
              <ChartContainer config={chartConfig} className="h-full">
                <LineChart
                  accessibilityLayer
                  data={promotionData}
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
                    fontSize={16}
                    dy={-2}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="promotions"
                    type="linear"
                    stroke="var(--color-promotions)"
                    strokeWidth={3}
                    dot={{ fill: "#000000", stroke: "#000000", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Average Time Between Levels */}
          <Card className="h-2/6 flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Time Between Levels</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto h-full hide-scrollbar max-h-full">
              <div className="space-y-3">
                {averageTimeData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.from}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{item.to}</span>
                    </div>
                    <Badge variant="secondary">{item.time}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Column */}
        <div className="space-y-6 h-full flex flex-col">
          {/* Team Leaderboard */}
          <Card className="h-2/6 flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Team Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto h-full hide-scrollbar max-h-full">
              <div className="space-y-4">
                {teamLeaderboard.map((team, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1 flex items-center space-x-4">
                      <span className="font-medium min-w-[120px]">{team.name}</span>
                      <div className="flex-1">
                        <Progress value={team.progress} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground min-w-[40px] text-right">{team.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills with Longest Development Time */}
          <Card className="h-1.5/6 flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Skills Development Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-full overflow-y-auto">
                {skillsData.slice(0, 3).map((skill, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge variant="outline">Level {skill.level}</Badge>
                    </div>
                    <span className="text-sm font-medium">{skill.time}</span>
                  </div>
                ))}
                {skillsData.length > 3 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{skillsData.length - 3} more skills
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Missing Positions */}
          <Card className="h-1.5/6 flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Missing Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {missingPositions.map((position, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                    <span className="font-medium">{position.position}</span>
                    <Badge variant="destructive">{position.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};
