import { Action } from 'src/casl/ability-factory/casl-ability.factory';

export const CTOPermissions = [
  // Users
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

  // Buckets
  {
    action: Action.Read,
    subject: 'BucketCategory',
    reason: 'View Bucket Categories',
  },
  {
    action: Action.Read,
    subject: 'BucketLevel',
    reason: 'View Bucket Levels',
  },
  {
    action: Action.Manage,
    subject: 'UserBucket',
    reason: 'Manage Bucket Levels',
  },

  // Team
  {
    action: Action.Manage,
    subject: 'Team',
    reason: 'Manage Teams',
  },
  {
    action: Action.Manage,
    subject: 'TeamMember',
    reason: 'Manage Team Members',
  },

  // Report
  {
    action: Action.Manage,
    subject: 'Report',
    reason: 'Manage Reports',
  },

  // Ticket
  {
    action: Action.Manage,
    subject: 'Ticket',
    reason: 'Manage Tickets',
  },
];
