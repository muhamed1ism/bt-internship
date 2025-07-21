import { getReportByIdApi } from '@app/api/report-api';
import { useQuery } from '@tanstack/react-query';
import { Report } from '@app/types/types';
import { useGetAuthorReports } from './useGetAuthorReports';

export const useGetReportById = (reportId: string) => {
  // Get author reports as fallback
  const { reports: authorReports } = useGetAuthorReports();
  
  const {
    data: report,
    isLoading,
    isSuccess,
    error,
  } = useQuery<Report>({
    queryKey: ['report', reportId],
    queryFn: () => getReportByIdApi(reportId),
    enabled: !!reportId,
  });

  // If the API returns an empty array, try to find the report in author reports
  const fallbackReport = Array.isArray(report) && report.length === 0 && authorReports 
    ? authorReports.find((r: Report) => r.id === reportId)
    : null;

  const finalReport = fallbackReport || report;

  console.log('🔍 useGetReportById Debug:', {
    reportId,
    report,
    fallbackReport,
    finalReport,
    isLoading,
    isSuccess,
    error,
    reportType: typeof report,
    isArray: Array.isArray(report),
    authorReportsCount: authorReports?.length
  });

  return { 
    report: finalReport, 
    isLoading, 
    isSuccess: isSuccess || !!fallbackReport, 
    error: fallbackReport ? null : error 
  };
}; 