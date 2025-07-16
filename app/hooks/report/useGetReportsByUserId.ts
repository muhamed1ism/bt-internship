import { useQuery } from '@tanstack/react-query';
import { getReportsByUserIdApi } from '@app/api/report-api';

export const useGetReportsByUserId = (userId: string) => {
  const {
    data: reports,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['reports-by-user-id', userId],
    queryFn: () => getReportsByUserIdApi(userId),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  return { reports, isLoading, isSuccess };
};
