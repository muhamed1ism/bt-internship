import { AbilityContext } from '@app/casl/AbilityContext';
import { UserTable } from '@app/features/users/components/UserTable';
import routeNames from '@app/routes/route-names';
import { useAbility } from '@casl/react';
import { Navigate } from 'react-router-dom';

export const Users = () => {
  const ability = useAbility(AbilityContext);

  if (ability.cannot('manage', 'Roles')) {
    return <Navigate to={routeNames.notAuthorized()} />;
  }

  return (
    <section className="flex h-full w-full flex-col items-center bg-gray-100">
      <div className="mx-auto mt-10 mb-16 h-full w-full max-w-7xl">
        <div className="mb-2">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage and view all users in your organization</p>
        </div>

        {/* Search bar, Status Filter and Table */}
        <UserTable />
      </div>
    </section>
  );
};
