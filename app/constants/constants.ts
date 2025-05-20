import { RoleType } from '@app/types/types';

export const allPermissions = {
  'User Management': [
    'user.create',
    'user.edit',
    'user.delete',
    'user.view',
    'user.assign_role',
    'user.assign_permission',
    'user.view_permissions',
  ],
  'Bucket Management': ['bucket.level.assign_user'],
  Dashboards: ['dashboard.admin.view', 'dashboard.team_lead.view', 'dashboard.user.view'],
  'Evaluation & Promotions': [
    'evaluation.create',
    'evaluation.view',
    'evaluation.comment',
    'evaluation.promote',
    'evaluation.summary.view',
    'evaluation.report.download',
  ],
  Reports: [
    'report.user.view',
    'report.user.summary',
    'report.user.modal_view',
    'report.user.write',
  ],
  'Roles & Permissions': [
    'role.create',
    'role.edit',
    'role.delete',
    'role.view',
    'permission.view_all',
  ],
};

export const initialRoles: RoleType[] = [
  {
    id: '1',
    name: 'Admin',
    permissions: {
      'User Management': [
        'user.create',
        'user.edit',
        'user.delete',
        'user.view',
        'user.assign_role',
        'user.assign_permission',
        'user.view_permissions',
      ],
      'Roles & Permissions': [
        'role.create',
        'role.edit',
        'role.delete',
        'role.view',
        'permission.view_all',
      ],
      Dashboards: ['dashboard.admin.view', 'dashboard.team_lead.view', 'dashboard.user.view'],
    },
  },
  {
    id: '2',
    name: 'CTO',
    permissions: {
      'User Management': ['user.view', 'user.assign_role'],
      'Roles & Permissions': ['role.view'],
      Dashboards: ['dashboard.admin.view'],
      'Evaluation & Promotions': [
        'evaluation.view',
        'evaluation.summary.view',
        'evaluation.report.download',
      ],
    },
  },
];
