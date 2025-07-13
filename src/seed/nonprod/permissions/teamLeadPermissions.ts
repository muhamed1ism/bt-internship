import { Action } from 'src/casl/ability-factory/casl-ability.factory';

export const teamLeadPermissions = [
  // User permissions
  { action: Action.Read, subject: 'User' },
  {
    action: Action.Update,
    subject: 'User',
    conditions: { id: { $ne: '${user.id}' } },
  },
  { action: Action.Read, subject: 'Role' },

  // Bucket permissions
  { action: Action.Create, subject: 'Bucket' },
  { action: Action.Read, subject: 'Bucket' },
  { action: Action.Update, subject: 'Bucket' },
  { action: Action.Delete, subject: 'Bucket' },
  { action: Action.Read, subject: 'BucketCategory' },
  { action: Action.Read, subject: 'BucketLevel' },

  // Team permissions
  { action: Action.Create, subject: 'Team' },
  { action: Action.Read, subject: 'Team' },
  { action: Action.Update, subject: 'Team' },
  { action: Action.Delete, subject: 'Team' },
  { action: Action.Create, subject: 'TeamMember' },
  { action: Action.Read, subject: 'TeamMember' },
  { action: Action.Update, subject: 'TeamMember' },
  { action: Action.Delete, subject: 'TeamMember' },

  // Report permissions
  { action: Action.Create, subject: 'Report' },
  { action: Action.Read, subject: 'Report' },
  { action: Action.Update, subject: 'Report' },
  { action: Action.Delete, subject: 'Report' },

  // Technology permissions
  { action: Action.Read, subject: 'Technology' },
];
