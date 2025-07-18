import { Action } from 'src/casl/ability-factory/casl-ability.factory';

export const teamLeadPermissions = [
  // User permissions
  {
    action: Action.Read,
    subject: 'User',
    reason: 'View All Users',
  },
  {
    action: Action.Update,
    subject: 'User',
    conditions: { id: { $eq: '${user.id}' } },
    fields: ['firstName', 'lastName', 'phoneNumber', 'dateOfBirth'],
    reason: 'Update own user profile',
  },

  // Bucket permissions
  {
    action: Action.Read,
    subject: 'BucketCategory',
    reason: 'View Bucket Categories',
  },
  { action: Action.Read, subject: 'BucketLevel', reason: 'View Bucket Levels' },
  { action: Action.Read, subject: 'UserBucket', reason: 'View User Buckets' },

  // Team permissions
  { action: Action.Manage, subject: 'Team', reason: 'Manage Team' },
  {
    action: Action.Manage,
    subject: 'TeamMember',
    reason: 'Manage Team Members',
  },

  // Report permissions
  { action: Action.Create, subject: 'Report', reason: 'Create Report' },
  { action: Action.Read, subject: 'Report', reason: 'View Reports' },
  { action: Action.Update, subject: 'Report', reason: 'Update Reports' },

  // Ticket
  {
    action: Action.Read,
    subject: 'Ticket',
    conditions: { id: { $ne: '${user.id}' } },
    reason: 'View own tickets',
  },
];
