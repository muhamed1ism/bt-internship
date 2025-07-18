import { useEffect, useState } from 'react';
import { SortConfig, SortDirection, User } from '../../../types/types';
import { ITEMS_PER_PAGE } from '@app/utils/constants';
import { getTotalPages } from '@app/utils/getTotalPages';

export function useFilteredUsers(users: User[]) {
  const itemsPerPage = ITEMS_PER_PAGE;
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: SortDirection.Ascending,
  });

  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  const searchableFields = ['firstName', 'lastName', 'email', 'id', 'role'];

  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter((user) =>
        searchableFields.some((field) =>
          user[field as keyof User]?.toString().toLowerCase().includes(lowerCaseQuery),
        ),
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((user) => user.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof User];
        const bValue = b[sortConfig.key as keyof User];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === SortDirection.Ascending ? 1 : -1;
        if (bValue == null) return sortConfig.direction === SortDirection.Ascending ? -1 : 1;

        if (aValue < bValue) {
          return sortConfig.direction === SortDirection.Ascending ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === SortDirection.Ascending ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, sortConfig, users]);

  // Pagination
  const totalPages = getTotalPages(filteredUsers.length, itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return {
    filteredUsers,
    currentItems,
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    setCurrentPage,
  };
}
