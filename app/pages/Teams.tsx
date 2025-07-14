import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewMode } from '@app/types/team';

import routeNames from '@app/routes/route-names';
import { useGetAllTeamsWithLeaders } from '@app/hooks/team';
import { useFilteredTeams, useTeamForm } from '@app/features/team/hooks';
import { TeamsControls } from '@app/features/team/components/control/TeamsControls';
import { TeamsGrid } from '@app/features/team/components/TeamsGrid';
import { TeamsEmptyState } from '@app/features/team/components/TeamsEmptyState';
import { TeamFormModal } from '@app/features/team/components/modal/TeamFormModal';

export const Teams = () => {
  const navigate = useNavigate();
  const { teams, isSuccess } = useGetAllTeamsWithLeaders();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { filteredTeams } = useFilteredTeams(teams, searchQuery);

  const { formState, openCreateForm, openEditForm, closeForm } = useTeamForm();

  const handleViewTeam = (teamId: string) => {
    navigate(routeNames.teamView({ teamId }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto mt-4 max-w-7xl">
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
            Found {filteredTeams?.length} team{filteredTeams?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Teams Grid or Empty State */}
        {filteredTeams && filteredTeams.length > 0 ? (
          <TeamsGrid
            teams={filteredTeams}
            viewMode={viewMode}
            onViewTeam={handleViewTeam}
            onEditTeam={openEditForm}
          />
        ) : (
          <TeamsEmptyState onCreateTeam={openCreateForm} />
        )}

        {/* Team Form Modal */}
        <TeamFormModal
          isOpen={formState.isOpen}
          onClose={closeForm}
          mode={formState.mode}
          team={formState.team}
        />
      </div>
    </div>
  );
};
