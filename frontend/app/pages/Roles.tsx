import { AbilityContext } from '@app/casl/AbilityContext';
import RolesTable from '@app/features/roles/components/RolesTable';
import routeNames from '@app/routes/route-names';
import { useAbility } from '@casl/react';
import { Navigate } from 'react-router-dom';

export const Roles = () => {
  const ability = useAbility(AbilityContext);

  if (ability.cannot('manage', 'Roles')) {
    <Navigate to={routeNames.notAuthorized()} />;
  }

  return (
    <div className="flex h-full flex-col items-center bg-gray-100">
      <RolesTable />
    </div>
  );
};
