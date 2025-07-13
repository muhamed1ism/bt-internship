import { subject } from '@casl/ability';
import { Action, Subject } from 'src/casl/ability-factory/casl-ability.factory';

export const userPermissions = [
  // USER PERMISSIONS
  {
    action: Action.Read,
    subject: 'User',
    conditions: { id: { $eq: '${user.id}' } },
  },
  {
    action: Action.Update,
    subject: 'User',
    conditions: { id: { $eq: '${user.id}' } },
    fields: ['firstName', 'lastName', 'phoneNumber', 'dateOfBirth'],
  },

  // BUCKET PERMISSIONS
  // Bucket Category
  { action: Action.Read, subject: 'BucketCategory' },
  // Bucket Level
  { action: Action.Read, subject: 'BucketLevel' },
  // User Bucket
  {
    action: Action.Read,
    subject: 'UserBucket',
    conditions: { userId: { $eq: '${user.id}' } },
  },

  // TEAM PERMISSIONS
  {
    action: Action.Read,
    subject: 'Team',
    conditions: {
      'members.user.id': { $eq: '${user.id}' },
    },
  },
  {
    action: Action.Read,
    subject: 'TeamMember',
    conditions: {
      'user.id': { $eq: '${user.id}' },
    },
  },
  // REPORT PERMISSIONS
  {
    action: Action.Read,
    subject: 'Report',
    conditions: { userId: { $eq: '${user.id}' } },
  },

  // TECHNOLOGY PERMISSIONS
  { action: Action.Read, subject: 'Technology' },
];
