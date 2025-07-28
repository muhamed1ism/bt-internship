export const NotAuthorized = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 bg-gray-100">
      <h1 className="text-primary text-3xl">Not Authorized</h1>
      <p className="text-muted-foreground">You do not have permission to view this page.</p>
    </div>
  );
};
