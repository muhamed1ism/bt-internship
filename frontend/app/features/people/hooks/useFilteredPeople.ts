import { User } from '@app/types/types';
import { useMemo } from 'react';

export const useFilteredPeople = (users: User[] | undefined, searchQuery: string) => {
  const filteredPeople = useMemo(() => {
    if (!users) return [];

    const query = searchQuery.trim().toLowerCase();

    return users
      .filter((user) => {
        const matchesSearch =
          !query ||
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.name.toLowerCase().includes(query);

        return matchesSearch;
      })
      .sort((a, b) => {
        // Sort by status: active first, then inactive, then pending
        const statusOrder = { active: 0, inactive: 1, pending: 2 };
        const aOrder = statusOrder[a.status.toLowerCase() as keyof typeof statusOrder] ?? 3;
        const bOrder = statusOrder[b.status.toLowerCase() as keyof typeof statusOrder] ?? 3;

        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }

        // If same status, sort alphabetically by name
        const aName = `${a.firstName} ${a.lastName}`.toLowerCase();
        const bName = `${b.firstName} ${b.lastName}`.toLowerCase();
        return aName.localeCompare(bName);
      });
  }, [users, searchQuery]);

  return { filteredPeople };
};
