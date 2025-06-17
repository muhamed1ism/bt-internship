import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_TEAM_DETAILS } from '@app/constants/team-members';
import { TeamHeader, MembersGrid } from '@app/features/team/TeamView';

export const TeamView = () => {
  // In a real app, you'd fetch team data based on the ID from params
  const { teamId } = useParams<{ teamId: string }>();
  console.log('Team ID:', teamId); // TODO: Remove when implementing real data fetching
  const [teamDetails] = useState(MOCK_TEAM_DETAILS);

  const handleManageMembers = () => {
    console.log('Manage members clicked');
    // TODO: Open manage members modal or navigate to management page
  };

  const handleEditTeam = () => {
    console.log('Edit team clicked');
    // TODO: Open edit team modal or navigate to edit page
  };

  const handleSubmitReport = (memberId: string) => {
    console.log('Submit report for member:', memberId);
    // TODO: Open submit report modal or navigate to report page
  };

  const handleChangePosition = (memberId: string) => {
    console.log('Change position for member:', memberId);
    // TODO: Open change position modal or navigate to position change page
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Team Header */}
        <TeamHeader
          teamDetails={teamDetails}
          onManageMembers={handleManageMembers}
          onEdit={handleEditTeam}
        />

        {/* Members Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-foreground mb-2 text-2xl font-bold">Team Members</h2>
            <p className="text-muted-foreground">Manage and view details of all team members</p>
          </div>

          <MembersGrid
            members={teamDetails.members}
            onSubmitReport={handleSubmitReport}
            onChangePosition={handleChangePosition}
          />
        </div>
      </div>
    </div>
  );
};
