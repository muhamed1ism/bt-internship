import { useMemo } from 'react';
import { Team } from '@app/types/team';

export function useFilteredTeams(teams: Team[] | undefined, searchQuery: string) {
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;

    if (!teams) return [];

    return teams.filter((team) => {
      const leadNames =
        team && team.members && team.members.length > 0
          ? team.members
              .map((lead) => {
                return `${lead.user.firstName} ${lead.user.lastName}`;
              })
              .join(' ')
          : '';
      const query = searchQuery.toLowerCase();

      return team.name.toLowerCase().includes(query) || leadNames.toLowerCase().includes(query);
    });
  }, [teams, searchQuery]);

  return { filteredTeams };
}
