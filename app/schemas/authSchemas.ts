import { z } from 'zod';

const registerFormSchema = z
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

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Enter the password'),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const authSchema = {
  register: registerFormSchema,
  login: loginFormSchema,
};

export default authSchema;
