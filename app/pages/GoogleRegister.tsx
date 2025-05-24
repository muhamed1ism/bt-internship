import { FormDatePicker } from '@app/components/forms/FormDatePicker';
import { FormInputField } from '@app/components/forms/FormInputField';
import { Button } from '@app/components/ui/button';
import { Form, FormMessage } from '@app/components/ui/form';
import { useGoogleProfile, useGoogleRegister } from '@app/hooks/auth';
import { authSchema, RegisterFormValues } from '@app/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const GoogleRegister = () => {
  const { mutate, isPending, error } = useGoogleRegister();
  const { firstName, lastName, email } = useGoogleProfile();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(authSchema.register),
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

  useEffect(() => {
    if (firstName || lastName || email) {
      form.reset({
        ...form.getValues(),
        firstName,
        lastName,
        email,
      });
    }
  }, [firstName, lastName, email]);

  const onSubmit = (formData: RegisterFormValues) => {
    mutate(formData);
  };

  return (
    <section className="flex h-full flex-col items-center justify-center bg-gray-100 px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Register</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-start gap-4 min-lg:flex-row">
            <FormInputField control={form.control} name="firstName" label="First Name" />

            <FormInputField control={form.control} name="lastName" label="Last Name" />
          </div>

          <FormInputField control={form.control} name="email" label="Email" disabled />

          <FormInputField control={form.control} type="password" name="password" label="Password" />

          <FormInputField
            control={form.control}
            type="password"
            name="confirmPassword"
            label="Confirm Password"
          />

          <div className="flex flex-col items-start gap-4 min-lg:flex-row">
            <FormInputField control={form.control} name="phoneNumber" label="Phone Number" />

            <FormDatePicker control={form.control} name="dateOfBirth" label="Date of Birth" />
          </div>

          {error && (
            <FormMessage className="rounded-lg bg-red-200 px-2 py-2">{error.message}</FormMessage>
          )}

          <div className="flex items-center justify-end gap-4 pt-2 pl-2">
            <Button size="lg" type="submit" disabled={isPending}>
              {isPending ? 'Loading...' : 'Register'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};
