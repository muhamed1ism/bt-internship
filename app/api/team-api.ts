import { getAuthHeaders } from '@app/lib/firebase';
import { BASE_URL, ENDPOINTS } from './api-config';
import {
  AddMembersFormValues,
  CreateTeamFormValues,
  UpdateMemberPositionFormValues,
  UpdateTeamFormValues,
} from '@app/schemas';

export const getAllTeamsApi = async () => {
  const { uri, method } = ENDPOINTS.team.getAll;
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
      throw new Error(error.message || 'Failed to fetch teams');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch teams: ', error);
    throw error;
  }
};

export const getUserTeamsApi = async () => {
  const { uri, method } = ENDPOINTS.team.getUserTeams;
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
      throw new Error(error.message || 'Failed to fetch teams');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch teams: ', error);
    throw error;
  }
};

export const createTeamApi = async (formData: CreateTeamFormValues) => {
  const { uri, method } = ENDPOINTS.team.add;
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
      throw new Error(error.message || 'Failed to add team');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to add team: ', error);
    throw error;
  }
};

export const updateTeamApi = async (formData: UpdateTeamFormValues, teamId: string) => {
  const { uri, method } = ENDPOINTS.team.update(teamId);
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
      throw new Error(error.message || 'Failed to update team');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to update team: ', error);
    throw error;
  }
};

export const deleteTeamApi = async (teamId: string) => {
  const { uri, method } = ENDPOINTS.team.delete(teamId);
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
      throw new Error(error.message || 'Failed to delete team');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to delete team: ', error);
    throw error;
  }
};

export const getTeamMembersApi = async (teamId: string) => {
  const { uri, method } = ENDPOINTS.team.member.get(teamId);
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
      throw new Error(error.message || 'Failed to fetch team members');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch team members: ', error);
    throw error;
  }
};

export const addMembersApi = async (formData: AddMembersFormValues) => {
  const { uri, method } = ENDPOINTS.team.add;
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
      throw new Error(error.message || 'Failed to add members to team');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to add team: ', error);
    throw error;
  }
};

export const updateMemberPositionApi = async (
  formData: UpdateMemberPositionFormValues,
  teamId: string,
  memberId: string,
) => {
  const { uri, method } = ENDPOINTS.team.member.updatePosition(teamId, memberId);
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
      throw new Error(error.message || "Failed to update team member's position");
    }

    return res.json();
  } catch (error) {
    console.error("Failed to update team member's position: ", error);
    throw error;
  }
};

export const deleteMemberApi = async (teamId: string, userId: string) => {
  const { uri, method } = ENDPOINTS.team.member.delete(teamId, userId);
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
      throw new Error(error.message || 'Failed to delete team member');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to delete team member: ', error);
    throw error;
  }
};
