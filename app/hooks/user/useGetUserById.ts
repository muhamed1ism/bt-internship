import { useQuery } from '@tanstack/react-query';
import { useGetAllUsers } from './useGetAllUsers';
import { UserType } from '@app/types/types';

export const useGetUserById = (userId: string) => {
  const { users, isLoading, error } = useGetAllUsers();

  // Find the specific user from the users list
  const user = users?.find((u: UserType) => u.id === userId);

  return { user, isLoading, isSuccess: !error && !isLoading };
}; 