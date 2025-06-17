import { Team } from '@app/types/team';

// Mock data for teams
export const MOCK_TEAMS: Team[] = [
  {
    id: 1,
    teamNumber: 1,
    teamLead: { firstName: 'John', lastName: 'Doe' },
    memberCount: 5,
  },
  {
    id: 2,
    teamNumber: 2,
    teamLead: { firstName: 'Jane', lastName: 'Smith' },
    memberCount: 4,
  },
  {
    id: 3,
    teamNumber: 3,
    teamLead: { firstName: 'Michael', lastName: 'Johnson' },
    memberCount: 6,
  },
  {
    id: 4,
    teamNumber: 4,
    teamLead: { firstName: 'Emily', lastName: 'Davis' },
    memberCount: 5,
  },
  {
    id: 5,
    teamNumber: 5,
    teamLead: { firstName: 'David', lastName: 'Wilson' },
    memberCount: 3,
  },
  {
    id: 6,
    teamNumber: 6,
    teamLead: { firstName: 'Sarah', lastName: 'Brown' },
    memberCount: 7,
  },
  {
    id: 7,
    teamNumber: 7,
    teamLead: { firstName: 'Ryan', lastName: 'Taylor' },
    memberCount: 4,
  },
  {
    id: 8,
    teamNumber: 8,
    teamLead: { firstName: 'Lisa', lastName: 'Anderson' },
    memberCount: 5,
  },
];

// Default team for component development
export const DEFAULT_TEAM: Team = {
  id: 0,
  teamNumber: 5,
  teamLead: { firstName: 'firstName', lastName: 'lastName' },
  memberCount: 5,
};
