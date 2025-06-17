import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_TEAM_DETAILS } from '@app/constants/team-members';
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
    // Convert team details to form format
    const formData = {
      id: teamDetails.id,
      name: `Team ${teamDetails.teamNumber}`,
      technologies: [
        { id: 'react', name: 'React', color: 'bg-blue-500' },
        { id: 'nodejs', name: 'Node.js', color: 'bg-emerald-600' },
      ],
      client: 'Enterprise Client',
      status: 'in-progress',
      startDate: teamDetails.project?.startDate || '2025-03-19',
      endDate: '2025-06-19',
      projectDescription: teamDetails.project?.description || 'Project description',
      projectName: teamDetails.project?.name || 'Project Name',
      githubUrls: ['https://github.com/company/project', 'https://github.com/company/project-docs'],
      jiraUrls: [
        'https://company.atlassian.net/browse/PROJ',
        'https://company.atlassian.net/browse/PROJ-QA',
      ],
      budget: 200000,
      priority: 'high' as const,
    };
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
