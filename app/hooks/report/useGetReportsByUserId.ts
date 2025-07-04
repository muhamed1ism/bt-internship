import { useQuery } from '@tanstack/react-query';
import { getReportsByUserIdApi } from '@app/api/report-api';

export const useGetReportsByUserId = (userId: string) => {
  const {
    data: reports,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['reports-by-user-id'],
    queryFn: () => getReportsByUserIdApi(userId),
  });

  return { reports, isLoading, isSuccess };
};
