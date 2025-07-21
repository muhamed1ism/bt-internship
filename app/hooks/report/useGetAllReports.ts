import { useQuery } from '@tanstack/react-query';
import { getAllReportsApi } from '@app/api/report-api';

export const useGetAllReports = () => {
  const {
    data: reports,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['all-reports'],
    queryFn: getAllReportsApi,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  return { reports, isLoading, isSuccess };
}; 