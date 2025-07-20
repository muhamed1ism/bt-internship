import { AbilityContext } from '@app/casl/AbilityContext';
import routeNames from '@app/routes/route-names';
import { useAbility } from '@casl/react';
import { Navigate } from 'react-router-dom';

export const Evaluation = () => {
  const ability = useAbility(AbilityContext);

  if (ability.cannot('manage', 'UserBucket')) {
    return <Navigate to={routeNames.notAuthorized()} />;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">Welcome to the Evaluations Page!</h1>
      <p className="text-lg">This is a simple example of a React component.</p>
    </div>
  );
};
