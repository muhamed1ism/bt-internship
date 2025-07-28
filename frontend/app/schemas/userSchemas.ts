import z from 'zod';

const updateProfileFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
    invalid_type_error: 'Date of birth must be a valid date',
  }),
  phoneNumber: z.string().regex(/^\+?[0-9]\d{5,14}$/, 'Please enter a valid phone number'),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileFormSchema>;

export const userSchemas = {
  updateProfile: updateProfileFormSchema,
};

export default userSchemas;
