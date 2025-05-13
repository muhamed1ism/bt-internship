import { Button } from '@app/components/ui/button';
import { DatePicker } from '@app/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@app/components/ui/form';
import { Input } from '@app/components/ui/input';
import { useRegister } from '@app/hooks/auth';
import routeNames from '@app/routes/route-names';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

export const Register = () => {
  const { mutate, isPending, error } = useRegister();
  const formSchema = z
    .object({
      firstName: z.string().min(2, 'First name must be at least 2 characters'),
      lastName: z.string().min(2, 'Last name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email address'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol'),
      confirmPassword: z.string(),
      dateOfBirth: z.date({
        required_error: 'Date of birth is required',
        invalid_type_error: 'Date of birth must be a valid date',
      }),
      phoneNumber: z.string().regex(/^\+?[0-9]\d{5,14}$/, 'Please enter a valid phone number'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      dateOfBirth: undefined,
    },
  });

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    mutate(formData);
  };

  return (
    <section className="flex h-full flex-col items-center justify-center bg-gray-100 px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-start gap-4 min-lg:flex-row">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      className="border-primary/50 border-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      className="border-primary/50 border-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" className="border-primary/50 border-1" {...field} />
                </FormControl>
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    className="border-primary/50 border-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-start gap-4 min-lg:flex-row">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      className="border-primary/50 border-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      className="bg-secondary border-primary/50 w-full border-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && (
            <FormMessage className="rounded-lg bg-red-200 px-2 py-2">{error.message}</FormMessage>
          )}
          <div className="flex items-center justify-end gap-4 pt-2 pl-2">
            <span>
              Already have an account?&nbsp;
              <Link to={routeNames.login()} className="text-blue-600 hover:text-blue-800">
                Login
              </Link>
            </span>
            <Button size="lg" type="submit" disabled={isPending}>
              {isPending ? 'Loading...' : 'Register'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};
