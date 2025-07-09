import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewMode } from '@app/types/team';
import {
  useFilteredTeams,
  TeamsControls,
  TeamsGrid,
  TeamsEmptyState,
  TeamFormModal,
  useTeamForm,
} from '@app/features/team';
import { useGetAllTeamsWithMembers } from '@app/hooks/team/useGetAllTeamsWithMembers';
import { Spinner } from '@app/components/ui/spinner';
import routeNames from '@app/routes/route-names';

export const Teams = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Get teams from backend
  const { teams, isLoading, error, backendTeams } = useGetAllTeamsWithMembers();
  
  const { filteredTeams } = useFilteredTeams(teams || [], searchQuery);
  const { formState, openCreateForm, openEditForm, closeForm, handleSave, handleRemove } =
    useTeamForm();

  const handleViewTeam = (teamId: number) => {
    navigate(routeNames.teamView({ teamId: teamId.toString() }));
  };

  const handleEditTeam = (teamId: number) => {
    // Find the backend team data for the form
    const backendTeam = backendTeams?.find((t: any) => {
      const numericId = parseInt(t.id.replace(/-/g, '').substring(0, 8), 16);
      return numericId === teamId;
    });
    
    if (backendTeam) {
      // Convert backend data to form format matching the expected schema
      const formData = {
        name: backendTeam.name,
        status: backendTeam.status,
        technologies: backendTeam.technologies.map((tech: any) => ({
          id: tech.id,
          name: tech.name,
          color: 'bg-blue-500' // Default color since backend doesn't provide it
        })),
        client: backendTeam.clientName,
        startDate: backendTeam.startDate.split('T')[0], // Convert to YYYY-MM-DD format
        projectDescription: backendTeam.projectDescription,
        projectName: backendTeam.name, // Use team name as project name
        githubUrls: [backendTeam.githubLink],
        jiraUrls: [],
        priority: 'medium' as const, // Default priority since backend doesn't provide it
        endDate: backendTeam.endDate ? backendTeam.endDate.split('T')[0] : undefined,
        budget: undefined
      };
      openEditForm(formData);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto mt-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-foreground mb-2 text-3xl font-bold">Teams</h1>
            <p className="text-muted-foreground">Manage and view all teams in your organization</p>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="large" />
              <p className="text-muted-foreground">Loading teams...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto mt-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-foreground mb-2 text-3xl font-bold">Teams</h1>
            <p className="text-muted-foreground">Manage and view all teams in your organization</p>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <p className="text-destructive text-lg font-semibold">Failed to load teams</p>
              <p className="text-muted-foreground text-sm">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
