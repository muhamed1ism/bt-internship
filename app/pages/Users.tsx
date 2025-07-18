import { UserTable } from '@app/features/users/components/UserTable';

export const Users = () => {
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
