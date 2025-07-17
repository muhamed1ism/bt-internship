import { createColumn } from '@app/components/table/CreateColumn';
import { DataTable } from '@app/components/table/DataTable';
import { GlobalSearchInput } from '@app/components/table/GlobalSearchInput';
import { UserType } from '@app/types/types';
import { useState } from 'react';
import { userGlobalFilterFn } from '../lib/table/globalFilterFns';
import { ColumnDef } from '@tanstack/react-table';
import { ActionColumn } from './column/ActionColumn';
import { StatusFilter } from './StatusFilter';
import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';
import { StatusColumn } from './column/StatusColumn';
import { Spinner } from '@app/components/ui/spinner';

export const UserTable = () => {
  const { users, isLoading, error } = useGetAllUsers();
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const globalFilter = `${searchInput}|||${statusFilter}`;

  const columns: ColumnDef<UserType, any>[] = [
    createColumn<UserType>('id', 'ID'),
    createColumn<UserType>('email', 'Email'),
    createColumn<UserType>('firstName', 'First Name'),
    createColumn<UserType>('lastName', 'Last Name'),
    StatusColumn,
    createColumn<UserType>('role', 'Role', (row) => row.role.name),
    ActionColumn,
  ];

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="large" />
      </div>
    );

  if (error)
    return (
      <div className="text-muted-foreground flex h-full w-full items-center justify-center text-xl">
        Failed to load users
      </div>
    );

  return (
    <>
      <div className="flex w-full flex-row items-center gap-4">
        <GlobalSearchInput
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search users..."
          className="my-6"
        />

        <StatusFilter statusFilter={statusFilter} onStatusFilter={setStatusFilter} />
      </div>

      <DataTable<UserType, any>
        columns={columns}
        data={users ?? []}
        globalFilter={globalFilter}
        globalFilterFn={userGlobalFilterFn}
      />
    </>
  );
};
