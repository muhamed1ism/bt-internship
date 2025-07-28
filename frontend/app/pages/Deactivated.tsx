export const Deactivated = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 bg-gray-100">
      <h1 className="text-primary text-3xl">⚠️ Account Inactive</h1>
      <p className="text-muted-foreground text-center">
        Your account is currently inactive and access to the platform has been restricted.
        <br />
        This may be due to administrative action or a policy - related reason.
        <br />
        If you believe this is a mistake or have questions about your account status,
        <br />
        please contact the administrator.
      </p>
    </div>
  );
};
