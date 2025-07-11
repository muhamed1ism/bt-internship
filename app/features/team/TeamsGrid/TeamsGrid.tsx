import { Team, ViewMode } from '@app/types/team';
import { TeamCard } from '../TeamCard';

interface TeamsGridProps {
  teams: Team[];
  viewMode: ViewMode;
  onViewTeam: (teamId: string) => void;
  onEditTeam: (teamId: string) => void;
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
      {teams.map((team) => {
        const teamLeads = team.members ?? [];
        console.log(teamLeads);

        return (
          <TeamCard
            key={team.id}
            teamName={team.name}
            teamLeaders={teamLeads}
            viewMode={viewMode}
            memberCount={team._count.members}
            onView={() => onViewTeam(team.id)}
            onEdit={() => onEditTeam(team.id)}
          />
        );
      })}
    </div>
  );
};
