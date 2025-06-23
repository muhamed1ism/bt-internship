import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_TEAMS, createTeamFormData } from '@mocks/teams';
import { ViewMode } from '@app/types/team';
import {
  useFilteredTeams,
  TeamsControls,
  TeamsGrid,
  TeamsEmptyState,
  TeamFormModal,
  useTeamForm,
} from '@app/features/team';
import routeNames from '@app/routes/route-names';

export const Teams = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const { filteredTeams } = useFilteredTeams(MOCK_TEAMS, searchQuery);
  const { formState, openCreateForm, openEditForm, closeForm, handleSave, handleRemove } =
    useTeamForm();

  const handleViewTeam = (teamId: number) => {
    navigate(routeNames.teamView({ teamId: teamId.toString() }));
  };

  const handleEditTeam = (teamId: number) => {
    const team = MOCK_TEAMS.find((t) => t.id === teamId);
    if (team) {
      // Use clean, backend-ready form data from mocks
      const formData = createTeamFormData(team, 'sample');
      openEditForm(formData);
    }
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage and view all teams in your organization</p>
        </div>

        {/* Search and Controls */}
        <TeamsControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateTeam={openCreateForm}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground text-sm">
            Found {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Teams Grid or Empty State */}
        {filteredTeams.length > 0 ? (
          <TeamsGrid
            teams={filteredTeams}
            viewMode={viewMode}
            onViewTeam={handleViewTeam}
            onEditTeam={handleEditTeam}
          />
        ) : (
          <TeamsEmptyState onCreateTeam={openCreateForm} />
        )}

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
