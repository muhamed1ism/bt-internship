import { Team, ViewMode } from '@app/types/team';
import { TeamCard } from './card/TeamCard';
import { Spinner } from '@app/components/ui/spinner';

interface TeamsGridProps {
  teams: Team[];
  viewMode: ViewMode;
  onViewTeam: (teamId: string) => void;
  onEditTeam: (team: Team) => void;
  isLoading: boolean;
}

export const TeamsGrid = ({
  teams,
  viewMode,
  onViewTeam,
  onEditTeam,
  isLoading,
}: TeamsGridProps) => {
  if (isLoading) {
    return (
      <div className="text-primary my-16 flex h-full w-full items-center justify-center">
        <Spinner size="medium" />
      </div>
    );
  }

  return (
    <div
      className={` ${
        viewMode === 'grid'
          ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'flex flex-col gap-4'
      } `}
    >
      {teams.map((team) => {
        const teamLeads = team.members ?? [];

        return (
          <TeamCard
            key={team.id}
            teamName={team.name}
            teamLeaders={teamLeads}
            viewMode={viewMode}
            memberCount={team._count.members}
            onView={() => onViewTeam(team.id)}
            onEdit={() => onEditTeam(team)}
          />
        );
      })}
    </div>
  );
};
