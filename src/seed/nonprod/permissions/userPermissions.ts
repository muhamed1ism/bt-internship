import { Action } from 'src/casl/ability-factory/casl-ability.factory';

export const userPermissions = [
  // USER PERMISSIONS
  {
    action: Action.Read,
    subject: 'User',
    conditions: { id: { $eq: '${user.id}' } },
    reason: 'View own profile',
  },
  {
    action: Action.Update,
    subject: 'User',
    conditions: { id: { $eq: '${user.id}' } },
    fields: ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth'],
    reason: 'Update own user profile',
  },

  // BUCKET PERMISSIONS
  // Bucket Category
  {
    action: Action.Read,
    subject: 'BucketCategory',
    reason: 'View Bucket Categories',
  },
  // Bucket Level
  {
    action: Action.Read,
    subject: 'BucketLevel',
    readon: 'View Bucket Levels',
  },
  // User Bucket
  {
    action: Action.Read,
    subject: 'UserBucket',
    conditions: { userId: { $eq: '${user.id}' } },
    reason: 'View own buckets',
  },

  // TEAM PERMISSIONS
  {
    action: Action.Read,
    subject: 'Team',
    conditions: {
      'members.user.id': { $eq: '${user.id}' },
    },
    reason: 'View own teams',
  },
  {
    action: Action.Read,
    subject: 'TeamMember',
    conditions: {
      'user.id': { $eq: '${user.id}' },
    },
    reason: 'View my team colleagues',
  },
];
