import { BackendTeam, TransformedTeam } from '@app/types/team';

/**
 * Transform backend team data to frontend format
 * Based on the backend API documentation provided
 */
export const transformTeamData = (backendTeam: BackendTeam): TransformedTeam => {
  // Handle case where members array might be undefined or null
  const members = backendTeam.members || [];
  
  // Find team lead (look for "Team Lead" position or use first member)
  const teamLead = members.find((member) => 
    member?.position?.toLowerCase().includes('lead') || 
    member?.position?.toLowerCase().includes('manager')
  ) || members[0];

  // Extract team number from team name (e.g., "Team 1" -> 1)
  const teamNumberMatch = backendTeam.name?.match(/\d+/);
  const teamNumber = teamNumberMatch ? parseInt(teamNumberMatch[0]) : 1;

  // Convert UUID to number for frontend compatibility
  const numericId = parseInt((backendTeam.id || '').replace(/-/g, '').substring(0, 8), 16) || 1;

  return {
    id: numericId,
    teamNumber,
    teamLead: {
      firstName: 'Unknown', // Will be populated when we have user data
      lastName: 'Lead'
    },
    memberCount: members.length,
    name: backendTeam.name || 'Unnamed Team',
    status: backendTeam.status || 'IN_PROGRESS',
    clientName: backendTeam.clientName || 'Unknown Client',
    technologies: backendTeam.technologies?.map(tech => tech?.name).filter(Boolean) || []
  };
};

/**
 * Transform multiple backend teams to frontend format
 */
export const transformTeamsData = (backendTeams: BackendTeam[]): TransformedTeam[] => {
  return backendTeams.map(transformTeamData);
};

/**
 * Transform backend team data to frontend format with user information
 */
export const transformTeamDataWithUsers = (backendTeam: BackendTeam, users: any[]): TransformedTeam => {
  // Handle case where members array might be undefined or null
  const members = backendTeam.members || [];
  

  
  // If no members data is available, we can't determine team lead
  // This happens when the backend doesn't include members in the team response
  if (members.length === 0) {
    // Extract team number from team name (e.g., "Team 1" -> 1)
    const teamNumberMatch = backendTeam.name?.match(/\d+/);
    const teamNumber = teamNumberMatch ? parseInt(teamNumberMatch[0]) : 1;

    // Convert UUID to number for frontend compatibility
    const numericId = parseInt((backendTeam.id || '').replace(/-/g, '').substring(0, 8), 16) || 1;

    return {
      id: numericId,
      teamNumber,
      teamLead: {
        firstName: 'Unknown',
        lastName: 'Lead'
      },
      memberCount: 0, // We don't know the member count without members data
      name: backendTeam.name || 'Unnamed Team',
      status: backendTeam.status || 'IN_PROGRESS',
      clientName: backendTeam.clientName || 'Unknown Client',
      technologies: backendTeam.technologies?.map(tech => tech?.name).filter(Boolean) || []
    };
  }
  
  // Find team lead (look for "Team Lead" position or use first member)
  const teamLeadMember = members.find((member) => 
    member?.position?.toLowerCase().includes('lead') || 
    member?.position?.toLowerCase().includes('manager')
  ) || members[0];

  // Find user information for team lead
  const teamLeadUser = teamLeadMember ? users.find(user => user.id === teamLeadMember.userId) : null;
  


  // Extract team number from team name (e.g., "Team 1" -> 1)
  const teamNumberMatch = backendTeam.name?.match(/\d+/);
  const teamNumber = teamNumberMatch ? parseInt(teamNumberMatch[0]) : 1;

  // Convert UUID to number for frontend compatibility
  const numericId = parseInt((backendTeam.id || '').replace(/-/g, '').substring(0, 8), 16) || 1;

  return {
    id: numericId,
    teamNumber,
    teamLead: {
      firstName: teamLeadUser?.firstName || 'Unknown',
      lastName: teamLeadUser?.lastName || 'Lead'
    },
    memberCount: members.length,
    name: backendTeam.name || 'Unnamed Team',
    status: backendTeam.status || 'IN_PROGRESS',
    clientName: backendTeam.clientName || 'Unknown Client',
    technologies: backendTeam.technologies?.map(tech => tech?.name).filter(Boolean) || []
  };
};

/**
 * Transform multiple backend teams to frontend format with user information
 */
export const transformTeamsDataWithUsers = (backendTeams: BackendTeam[], users: any[]): TransformedTeam[] => {
  return backendTeams.map(team => transformTeamDataWithUsers(team, users));
}; 