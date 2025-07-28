import { Row } from '@tanstack/react-table';

export const userGlobalFilterFn = <TData extends Record<string, any>>(
  row: Row<TData>,
  _columnId: string,
  filterValue: string,
): boolean => {
  const [searchPart, statusPart] = filterValue.split('|||');
  const search = searchPart.trim().toLowerCase() ?? '';
  const status = (statusPart ?? 'all').trim().toLowerCase();

  const fullName = [row.original['firstName'], row.original['lastName']]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const roleName = (row.original['role'] as any)?.name?.toLowerCase?.() ?? '';

  const matchesSearch = ['id', 'email', 'firstName', 'lastName', 'role', 'status'].some((key) => {
    const value = row.original[key as keyof TData];

    if (key === 'firstName' || key === 'lastName') {
      return fullName.includes(search);
    }

    if (key === 'role') {
      return roleName.includes(search);
    }

    if (value == null) return false;

    return String(value).toLowerCase().includes(search);
  });

  const matchesStatus = status === 'all' || row.original['status']?.toLowerCase?.() === status;

  return matchesSearch && matchesStatus;
};
