import { User } from '@app/types/types';

export const getStatusColor = (status: User['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 hover:bg-green-100/80';
    case 'inactive':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80';
    default:
      return '';
  }
};
