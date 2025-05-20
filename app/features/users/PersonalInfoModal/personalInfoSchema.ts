import { z } from 'zod';

export const personalInfoSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    dateOfBirth: z.string().regex(/^\d{2}\.\d{2}\.\d{4}\.$/, 'Invalid date format'),
    phoneNumber: z.string().min(7, 'Phone number is too short'),
    github: z.string().url('Invalid GitHub URL'),
    linkedin: z.string().url('Invalid LinkedIn URL'),
    experienceLevel: z.enum(['intern', 'junior', 'medior', 'senior', 'lead']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PersonalInfoFormType = z.infer<typeof personalInfoSchema>;
