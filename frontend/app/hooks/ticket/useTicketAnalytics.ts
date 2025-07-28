import { useQuery } from '@tanstack/react-query';
import {
  getTicketAnalyticsOverviewApi,
  getTicketTrendsApi,
  getTicketPerformanceApi,
  getRecentTicketsApi,
  getEmployeePerformanceApi,
} from '@app/api/ticket-analytics-api';

export const useTicketAnalytics = () => {
  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
  } = useQuery({
    queryKey: ['ticket-analytics-overview'],
    queryFn: getTicketAnalyticsOverviewApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: trends,
    isLoading: trendsLoading,
    error: trendsError,
  } = useQuery({
    queryKey: ['ticket-trends'],
    queryFn: () => getTicketTrendsApi(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: performance,
    isLoading: performanceLoading,
    error: performanceError,
  } = useQuery({
    queryKey: ['ticket-performance'],
    queryFn: getTicketPerformanceApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: recentTickets,
    isLoading: recentTicketsLoading,
    error: recentTicketsError,
  } = useQuery({
    queryKey: ['recent-tickets'],
    queryFn: () => getRecentTicketsApi(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const {
    data: employeePerformance,
    isLoading: employeePerformanceLoading,
    error: employeePerformanceError,
  } = useQuery({
    queryKey: ['employee-performance'],
    queryFn: () => getEmployeePerformanceApi(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const isLoading = overviewLoading || trendsLoading || performanceLoading || recentTicketsLoading || employeePerformanceLoading;
  const error = overviewError || trendsError || performanceError || recentTicketsError || employeePerformanceError;

  return {
    overview: overview || {
      total: 0,
      pending: 0,
      ongoing: 0,
      awaitingConfirmation: 0,
      finished: 0,
      resolutionRate: 0,
    },
    trends: trends || [],
    performance: performance || {
      avgResolutionTime: '0 days',
      avgResponseTime: '0 hours',
      escalationRate: 0,
      satisfactionScore: 0,
    },
    recentTickets: recentTickets || [],
    employeePerformance: employeePerformance || [],
    isLoading,
    error,
  };
}; 