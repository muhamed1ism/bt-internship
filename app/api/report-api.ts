import { getAuthHeaders } from '@app/lib/firebase';
import { BASE_URL, ENDPOINTS } from './api-config';
import { CreateReportFormValues, UpdateReportFormValues } from '@app/schemas';

export const getReportByIdApi = async (reportId: string) => {
  const { uri, method } = ENDPOINTS.report.getById(reportId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch report");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch report: ", error);
    throw error;
  }
};

export const getReportsByUserIdApi = async (userId: string) => {
  const { uri, method } = ENDPOINTS.report.getByUserId(userId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch user's reports");
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch user's reports: ", error);
    throw error;
  }
};

export const getAuthorReportsApi = async () => {
  const { uri, method } = ENDPOINTS.report.getAuthorReports;
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch author's reports");
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch author's reports: ", error);
    throw error;
  }
};

export const getUserReportsApi = async () => {
  const { uri, method } = ENDPOINTS.report.getUserReports;
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch user's reports");
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch user's reports: ", error);
    throw error;
  }
};

export const createReportApi = async (formData: CreateReportFormValues, userId: string) => {
  const { uri, method } = ENDPOINTS.report.add(userId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create report');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create report: ', error);
    throw error;
  }
};

export const updateReportApi = async (formData: UpdateReportFormValues, reportId: string) => {
  const { uri, method } = ENDPOINTS.report.update(reportId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update report');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to update report: ', error);
    throw error;
  }
};

export const deleteReportApi = async (reportId: string) => {
  const { uri, method } = ENDPOINTS.report.delete(reportId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete report');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to delete report: ', error);
    throw error;
  }
};
