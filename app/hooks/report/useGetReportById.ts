import { getReportsByUserIdApi } from '@app/api/report-api';
import { useQuery } from '@tanstack/react-query';
import { useGetAllUsers } from '@app/hooks/user';

export const useGetReportById = (reportId: string) => {
  // Get all users
  const { users } = useGetAllUsers();

  // Fetch reports for all users to find the specific report
  const userReportsQueries = users?.map(user => 
    useQuery({
      queryKey: ['user-reports', user.id],
      queryFn: () => getReportsByUserIdApi(user.id),
      enabled: !!reportId && !!users,
    })
  ) || [];

  // Combine all reports from all users
  const allReports = userReportsQueries.flatMap(query => query.data || []);

  // Find the specific report by ID
  const report = allReports.find((r: any) => r.id === reportId);

  // Combine loading states
  const isLoading = userReportsQueries.some(query => query.isLoading);
  const error = userReportsQueries.find(query => query.error)?.error;

  return { report, isLoading, isSuccess: !!report, error };
}; 