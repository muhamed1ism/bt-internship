import { useQuery } from '@tanstack/react-query';
import { getUserReportsApi } from '@app/api/report-api';

export const useGetUserReports = () => {
  const {
    data: reports,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['user-reports'],
    queryFn: getUserReportsApi,
  });

  return { reports, isLoading, isSuccess };
};
