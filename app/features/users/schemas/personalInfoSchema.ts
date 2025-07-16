import { z } from 'zod';

export const personalInfoSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),

    // Optional date, but if provided, must match format
    dateOfBirth: z
      .string()
      .regex(/^\d{2}\.\d{2}\.\d{4}\.$/, 'Invalid date format')
      .optional()
      .or(z.literal('')),

    // Optional phone number, must be valid if provided
    phoneNumber: z.string().min(7, 'Phone number is too short').optional().or(z.literal('')),

    // Optional GitHub URL
    github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),

    // Optional LinkedIn URL
    linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),

    experienceLevel: z.enum(['intern', 'junior', 'medior', 'senior', 'lead']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PersonalInfoFormType = z.infer<typeof personalInfoSchema>;
