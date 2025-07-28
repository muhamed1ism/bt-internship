import type { User } from '@app/types/types';

// Re-export for backward compatibility
export type { Role as RoleType } from '@app/types/shared';

// User table columns for sorting and display
export const USER_TABLE_COLUMNS: (keyof User)[] = [
  'id',
  'firstName',
  'lastName',
  'email',
  'role',
  'status',
];

// allPermissions has been moved to app/__mocks__/users.ts
// Please update your imports to use the new location:
// import { allPermissions } from '@app/__mocks__/users';

// Backward compatibility re-export
export { allPermissions } from '@app/__mocks__/users';

export const TOOLS = [
  { name: 'React.js', bg: 'bg-blue-400' },
  { name: 'Vue', bg: 'bg-green-500' },
  { name: 'Express.js', bg: 'bg-gray-600' },
  { name: 'AWS', bg: 'bg-orange-500' },
];

// Mock data has been moved to app/__mocks__/buckets.ts
// Please update your imports to use the new location:
// import { mockBuckets } from '@app/__mocks__/buckets';

// Backward compatibility re-export
export { mockBuckets } from '@app/__mocks__/buckets';

// initialRoles have been moved to app/__mocks__/users.ts as MOCK_ROLES
// Please update your imports to use the new location:
// import { MOCK_ROLES as initialRoles } from '@app/__mocks__/users';

// Backward compatibility re-export
export { MOCK_ROLES as initialRoles } from '@app/__mocks__/users';
