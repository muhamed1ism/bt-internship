import { getAuthorReportsApi } from '@app/api/report-api';
import { useQuery } from '@tanstack/react-query';

export const useGetAuthorReports = () => {
  const {
    data: reports,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['author-reports'],
    queryFn: getAuthorReportsApi,
  });

  return { reports, isLoading, isSuccess };
};
