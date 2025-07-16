import { z } from 'zod';

const teamFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  clientName: z.string().min(1, 'Client name is required'),
  status: z.string().min(1, 'Status is required'),
  startDate: z.coerce.date({ required_error: 'Start date is required' }),

  endDate: z.coerce.date().optional(),
  projectDescription: z.string().optional(),
  documentation: z.string().optional(),
  githubLink: z.string().url('Invalid GitHub link').optional().or(z.literal('')),
  technologies: z.array(z.string()).optional(),
});

const addMemberFormSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  position: z.string().min(1, 'Position is required'),
});

const addMembersFormSchema = z.object({
  members: z.array(addMemberFormSchema).min(1, 'At least one member is required'),
});

const updateMemberPositionFormSchema = z.object({
  position: z.string().min(3, 'Position name is required'),
});

export type AddMemberFormValues = z.infer<typeof addMemberFormSchema>;
export type AddMembersFormValues = z.infer<typeof addMembersFormSchema>;
export type UpdateMemberPositionFormValues = z.infer<typeof updateMemberPositionFormSchema>;
export type TeamFormValues = z.infer<typeof teamFormSchema>;

export const teamSchema = {
  form: teamFormSchema,
  addMember: addMemberFormSchema,
  addMembers: addMembersFormSchema,
  updatePosition: updateMemberPositionFormSchema,
};

export default teamSchema;
