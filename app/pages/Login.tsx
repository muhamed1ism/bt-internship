import { Link } from 'react-router-dom';
import logo from '@app/assets/logo/bloomteq_logo.png';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@app/components/ui/form';
import { Input } from '@app/components/ui/input';
import { Button } from '@app/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import routeNames from '@app/routes/route-names';
import { useLogin } from '@app/hooks/auth';

export const Login = () => {
  const { mutate, isPending, error } = useLogin();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    mutate(formData);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-100 px-4">
      <img src={logo} alt="Bloomteq logo" className="invert" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" className="border-primary/50 border-1" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    className="border-primary/50 border-1"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
            <Button size="lg" type="submit" disabled={isPending}>
              {isPending ? 'Loading...' : 'Login'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
