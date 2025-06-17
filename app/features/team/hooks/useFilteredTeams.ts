import { useMemo } from 'react';
import { Team } from '@app/types/team';

export function useFilteredTeams(teams: Team[], searchQuery: string) {
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;

    return teams.filter((team) => {
      const teamName = `Team ${team.teamNumber}`.toLowerCase();
      const leadName = `${team.teamLead.firstName} ${team.teamLead.lastName}`.toLowerCase();
      const query = searchQuery.toLowerCase();

      return teamName.includes(query) || leadName.includes(query);
    });
  }, [teams, searchQuery]);

  return { filteredTeams };
}
