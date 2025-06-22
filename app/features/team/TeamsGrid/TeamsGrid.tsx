import { Team, ViewMode } from '@app/types/team';
import { TeamCard } from '../TeamCard';

interface TeamsGridProps {
  teams: Team[];
  viewMode: ViewMode;
  onViewTeam: (teamId: number) => void;
  onEditTeam: (teamId: number) => void;
}

export const TeamsGrid = ({ teams, viewMode, onViewTeam, onEditTeam }: TeamsGridProps) => {
  return (
    <div
      className={` ${
        viewMode === 'grid'
          ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'flex flex-col gap-4'
      } `}
    >
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          teamNumber={team.teamNumber}
          teamLead={team.teamLead}
          viewMode={viewMode}
          memberCount={team.memberCount}
          onView={() => onViewTeam(team.id)}
          onEdit={() => onEditTeam(team.id)}
        />
      ))}
    </div>
  );
};
