import UserTable from '@app/features/users/UsersTable/UserTable';

export const Users = () => {
  return (
    <div className="flex h-screen flex-col items-center bg-gray-100">
      <UserTable />
    </div>
  );
};
