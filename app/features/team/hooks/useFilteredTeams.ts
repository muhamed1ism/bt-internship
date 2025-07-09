import { useMemo } from 'react';
import { TransformedTeam } from '@app/types/team';

export function useFilteredTeams(teams: TransformedTeam[], searchQuery: string) {
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;

    return teams.filter((team) => {
      const teamName = team.name.toLowerCase();
      const teamNumber = `Team ${team.teamNumber}`.toLowerCase();
      const leadName = `${team.teamLead.firstName} ${team.teamLead.lastName}`.toLowerCase();
      const clientName = team.clientName.toLowerCase();
      const query = searchQuery.toLowerCase();

      return (
        teamName.includes(query) || 
        teamNumber.includes(query) || 
        leadName.includes(query) ||
        clientName.includes(query)
      );
    });
  }, [teams, searchQuery]);

  return { filteredTeams };
}
