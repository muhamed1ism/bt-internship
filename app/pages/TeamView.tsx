import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_TEAM_DETAILS, createFormDataFromTeamDetails } from '@app/__mocks__/teams';
import { TeamHeader, MembersGrid, TeamFormModal, useTeamForm } from '@app/features/team';

export const TeamView = () => {
  // In a real app, you'd fetch team data based on the ID from params
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  console.log('Team ID:', teamId); // TODO: Remove when implementing real data fetching
  const [teamDetails] = useState(MOCK_TEAM_DETAILS);
  const { formState, openEditForm, closeForm, handleSave, handleRemove } = useTeamForm();

  const handleManageMembers = () => {
    navigate(`/teams/${teamId}/members`);
  };

  const handleEditTeam = () => {
    // Use clean, backend-ready form data from mocks
    const formData = createFormDataFromTeamDetails(teamDetails);
    openEditForm(formData);
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
    <div className="min-h-screen bg-gray-100 p-6 pt-16">
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

        {/* Team Form Modal */}
        <TeamFormModal
          isOpen={formState.isOpen}
          onClose={closeForm}
          onSave={handleSave}
          onRemove={handleRemove}
          mode={formState.mode}
          team={formState.team}
        />
      </div>
    </div>
  );
};
