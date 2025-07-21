import { BASE_URL } from './api-config';
import { getAuthHeaders } from '@app/lib/firebase';

// Ticket Analytics API endpoints
const ENDPOINTS = {
  analytics: {
    overview: '/tickets/analytics/overview',
    trends: '/tickets/analytics/trends',
    performance: '/tickets/analytics/performance',
  },
  tickets: {
    recent: '/tickets/recent',
  },
  employee: {
    performance: '/tickets/employee-performance',
  },
};

// Types for the API responses
export interface TicketAnalyticsOverview {
  total: number;
  pending: number;
  ongoing: number;
  awaitingConfirmation: number;
  finished: number;
  resolutionRate: number;
}

export interface TicketTrend {
  date: string;
  count: number;
  status: string;
}

export interface TicketPerformance {
  avgResolutionTime: string;
  avgResponseTime: string;
  escalationRate: number;
  satisfactionScore: number;
}

export interface EmployeePerformance {
  employeeId: string;
  employeeName: string;
  ticketsResolved: number;
  avgResolutionTime: string;
  satisfactionScore: number;
}

// API functions
export const getTicketAnalyticsOverviewApi = async (): Promise<TicketAnalyticsOverview> => {
  const authHeaders = await getAuthHeaders();
  
  try {
    const response = await fetch(BASE_URL + ENDPOINTS.analytics.overview, {
      method: 'GET',
      headers: {
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch ticket analytics overview');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch ticket analytics overview:', error);
    throw error;
  }
};

export const getTicketTrendsApi = async (period: string = 'weekly', limit: number = 12): Promise<TicketTrend[]> => {
  const authHeaders = await getAuthHeaders();
  
  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.analytics.trends}?period=${period}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          ...authHeaders,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch ticket trends');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch ticket trends:', error);
    throw error;
  }
};

export const getTicketPerformanceApi = async (): Promise<TicketPerformance> => {
  const authHeaders = await getAuthHeaders();
  
  try {
    const response = await fetch(BASE_URL + ENDPOINTS.analytics.performance, {
      method: 'GET',
      headers: {
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch ticket performance');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch ticket performance:', error);
    throw error;
  }
};

export const getRecentTicketsApi = async (limit: number = 10): Promise<any[]> => {
  const authHeaders = await getAuthHeaders();
  
  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.tickets.recent}?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          ...authHeaders,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch recent tickets');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch recent tickets:', error);
    throw error;
  }
};

export const getEmployeePerformanceApi = async (period: string = 'monthly'): Promise<EmployeePerformance[]> => {
  const authHeaders = await getAuthHeaders();
  
  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.employee.performance}?period=${period}`,
      {
        method: 'GET',
        headers: {
          ...authHeaders,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch employee performance');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch employee performance:', error);
    throw error;
  }
}; 