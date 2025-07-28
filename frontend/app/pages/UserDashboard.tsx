import { useNavigate } from 'react-router-dom';
import { useAuth } from '@app/context/AuthContext';
import { useGetUserTeams } from '@app/hooks/team/useGetMyTeams';
import { useGetMyUserBuckets } from '@app/hooks/bucket/user/useGetMyUserBuckets';
import { Team } from '@app/types/team';
import { UserBucketLevel } from '@app/types/bucket';
import { TeamCard } from '@app/features/team/components/card/TeamCard';
import BucketCard from '@app/features/buckets/components/BucketCard';
import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { HelpCircle } from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const { userTeams, isLoading: teamsLoading } = useGetUserTeams();
  const { userBuckets, isLoading: bucketsLoading } = useGetMyUserBuckets();
  const navigate = useNavigate();

  // Sort buckets by level descending and take top 3
  const topBuckets = (userBuckets || [])
    .sort((a, b) => (b.bucket.level || 0) - (a.bucket.level || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <div className="mx-auto mt-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Dashboard</h1>
        </div>

        {/* Teams Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">My Teams</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teamsLoading ? (
              <Card className="col-span-1 flex items-center justify-center min-h-[180px]">
                <CardContent className="flex items-center justify-center w-full h-full">Loading teams...</CardContent>
              </Card>
            ) : userTeams && userTeams.length > 0 ? (
              userTeams.map((team: Team) => (
                <TeamCard
                  key={team.id}
                  teamName={team.name}
                  teamLeaders={team.members ?? []}
                  viewMode="grid"
                  memberCount={team._count.members}
                  onView={() => navigate(`/teams/${team.id}`)}
                  onEdit={() => {}}
                />
              ))
            ) : (
              <Card className="col-span-1 flex items-center justify-center min-h-[180px]">
                <CardContent className="flex items-center justify-center w-full h-full text-muted-foreground">No teams assigned.</CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Buckets Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">My Top Buckets</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {bucketsLoading ? (
              <Card className="col-span-1 flex items-center justify-center min-h-[180px]">
                <CardContent className="flex items-center justify-center w-full h-full">Loading buckets...</CardContent>
              </Card>
            ) : topBuckets && topBuckets.length > 0 ? (
              topBuckets.map((userBucket: UserBucketLevel) => (
                <BucketCard
                  key={userBucket.bucketLevelId}
                  title={userBucket.bucket.category.name}
                  description={userBucket.bucket.category.description}
                  currentLevel={userBucket.bucket.level}
                  isActive={true}
                  id={userBucket.bucket.categoryId}
                  maxLevel={userBucket.bucket.level}
                  viewMode="grid"
                />
              ))
            ) : (
              <Card className="col-span-1 flex items-center justify-center min-h-[180px]">
                <CardContent className="flex items-center justify-center w-full h-full text-muted-foreground">No buckets assigned.</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {/* Discreet Help Button */}
      <Button
        onClick={() => navigate('/contact')}
        variant="outline"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-white/80 shadow-md hover:bg-white/100 border border-primary/30 text-primary flex items-center px-4 py-2 gap-2 backdrop-blur-sm"
        style={{ opacity: 0.85 }}
      >
        <HelpCircle className="h-5 w-5" />
        Help
      </Button>
    </div>
  );
};

// BACKEND REQUIREMENTS:
// 1. The endpoint for fetching user teams (getUserTeamsApi) must return all teams the user is a member of.
// 2. The endpoint for fetching user buckets (getMyUserBucketsApi) must return the user's level in each bucket for sorting.
// 3. If permissions are more granular (e.g., user can only see some teams/buckets), the backend should enforce and reflect this in the response. 