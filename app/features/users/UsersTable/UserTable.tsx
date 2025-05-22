import { useState } from 'react';

import { fake_users } from '../fake-data';

import { SortDirection, UserModalType, UserType } from '../../../types/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';

import { Search, X } from 'lucide-react';

import { getStatusColor } from '@app/utils/getStatusColor';

import { useFilteredUsers } from '../hooks/useFilteredUsers';

import { UserActionsDropdown } from './UserActionsDropdown ';
import { SortableHeader } from './SortableHeader';
import { PaginationControls } from './PaginationControls';
import { USER_TABLE_COLUMNS } from '@app/constants/example';
import SkillsModal from '../SkillsModal/SkillsModal';
import UserPermissionsModal from '../UserPermissionsModal/UserPermissionsModal';
import { PersonalInfoModal } from '../PersonalInfoModal/PersonalInfoModal';

const users = fake_users;

export default function UserTable() {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [activeModal, setActiveModal] = useState<null | UserModalType>(null);
  const [dropdownOpenUserId, setDropdownOpenUserId] = useState<string | number | null>(null);

  const {
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
  } = useFilteredUsers(users);

  const hasPagination = filteredUsers.length > 10;

  const clearSearch = () => setSearchQuery('');

  const handleSort = (key: keyof UserType) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === SortDirection.Ascending
          ? SortDirection.Descending
          : SortDirection.Ascending,
    }));
  };

  const handleSavePermissions = (updatedUser: UserType) => {
    // setFilteredUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
  };

  const openModal = (type: UserModalType, user: UserType) => {
    setSelectedUser(user);
    setActiveModal(type);
  };

  const handleOpenModal = (modalType: UserModalType, user: UserType) => {
    openModal(modalType, user);
    setDropdownOpenUserId(null);
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-6xl p-4">
      {/* SEARCH & FILTER */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full max-w-sm flex-1 md:w-auto">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search users..."
            className="pr-10 pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        <div className="w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {USER_TABLE_COLUMNS.map((key) => (
                <SortableHeader
                  key={key}
                  column={key}
                  sortKey={sortConfig.key}
                  direction={sortConfig.direction}
                  onSort={handleSort}
                />
              ))}
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)} variant="outline">
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <UserActionsDropdown
                      open={dropdownOpenUserId === user.id}
                      onOpenChange={(open) => setDropdownOpenUserId(open ? user.id : null)}
                      onOpenPersonal={() => handleOpenModal('personal', user)}
                      onOpenSkills={() => handleOpenModal('skills', user)}
                      onOpenRoles={() => handleOpenModal('roles', user)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {hasPagination && (
        <div className="flex justify-center py-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      <div className="text-muted-foreground mt-2 text-center text-sm">
        Showing {filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0} to{' '}
        {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
      </div>

      {/* MODALS */}
      <PersonalInfoModal
        open={activeModal === 'personal'}
        onOpenChange={() => setActiveModal(null)}
        user={selectedUser}
      />
      <SkillsModal
        open={activeModal === 'skills'}
        onOpenChange={() => setActiveModal(null)}
        user={selectedUser}
      />
      <UserPermissionsModal
        open={activeModal === 'roles'}
        onOpenChange={() => setActiveModal(null)}
        user={selectedUser}
        onSave={handleSavePermissions}
      />
    </div>
  );
}
