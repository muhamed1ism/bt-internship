import { Link } from 'react-router-dom';
import logo from '@app/assets/logo/bloomteq_logo.png';
import { Form, FormMessage } from '@app/components/ui/form';
import { Button } from '@app/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import routeNames from '@app/routes/route-names';
import { useLogin, useGoogleSignIn } from '@app/hooks/auth';
import { authSchema, LoginFormValues } from '@app/schemas';
import { FormInputField } from '@app/components/forms/FormInputField';
import { Spinner } from '@app/components/ui/spinner';

export const Login = () => {
  const { mutate, isPending, error } = useLogin();
  const { mutate: signInWithGoogle, isPending: googleIsPending } = useGoogleSignIn();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(authSchema.login),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (formData: LoginFormValues) => {
    mutate(formData);
  };

  const handleGoogle = () => {
    signInWithGoogle();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-100 px-4">
      <img src={logo} alt="Bloomteq logo" className="invert" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInputField control={form.control} name="email" label="Email" />

          <FormInputField control={form.control} type="password" name="password" label="Password" />

          {error && (
            <FormMessage className="rounded-lg bg-red-200 px-2 py-2">{error?.message}</FormMessage>
          )}

          <div className="flex items-center justify-end gap-4 pl-2">
            <span className="">
              Don't have an account?&nbsp;
              <Link to={routeNames.register()} className="text-blue-600 hover:text-blue-800">
                Register
              </Link>
            </span>

            <Button size="lg" type="submit" disabled={isPending} className="w-22">
              {isPending ? <Spinner className="text-secondary" /> : 'Login'}
            </Button>
          </div>
          <Button
            type="button"
            size="lg"
            variant="ghost"
            onClick={handleGoogle}
            disabled={googleIsPending}
            className="bg-card border-primary/15 text-primary h-12 w-full border-1"
          >
            {googleIsPending ? 'Loading...' : 'Sign up with Google'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
