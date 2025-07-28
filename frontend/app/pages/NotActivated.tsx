export const NotActivated = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-gray-100">
      <h1 className="text-primary text-3xl">Thank you for registering!</h1>
      <p className="text-muted-foreground text-center">
        Your account has been created but is not yet active.
        <br />
        An administrator must manually approve
        <br />
        your registration before you can access the platform.
        <br />
        Please check back later to see if your account has been activated.
        <br />
        If you believe this is taking too long or need assistance,
        <br />
        please contact the administrator directly.
      </p>
    </div>
  );
};
