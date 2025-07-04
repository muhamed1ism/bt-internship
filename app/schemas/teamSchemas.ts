import { z } from 'zod';

const createTeamFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  clientName: z.string().min(1, 'Client name is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  documentation: z.string().min(1, 'Documentation is required'),
  githubLink: z.string().url('Invalid GitHub link'),
  startDate: z.coerce.date({ required_error: 'Start date is required' }),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
});

const updateTeamFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  clientName: z.string().min(1, 'Client name is required'),
  status: z.string().min(1, 'Status is required'),
  startDate: z.coerce.date({ required_error: 'Start date is required' }),
  endDate: z.coerce.date({ required_error: 'End date is required' }),
  projectDescription: z.string().min(1, 'Project description is required'),
  documentation: z.string().min(1, 'Documentation is required'),
  githubLink: z.string().url('Invalid GitHub link'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
});

const addMemberFormSchema = z.object({
  position: z.string().min(1, 'Position is required'),
  userId: z.string().min(1, 'User ID is required'),
  teamId: z.string().min(1, 'Team ID is required'),
});

const addMembersFormSchema = z.object({
  members: z.array(addMemberFormSchema).min(1, 'At least one member is required'),
});

const updateMemberPositionFormSchema = z.object({
  position: z.string().min(3, 'Position name is required'),
});

const technologySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Technology name is required'),
  color: z.string(),
});

const teamFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Team name is required')
    .max(50, 'Team name must be less than 50 characters'),
  technologies: z
    .array(technologySchema)
    .min(1, 'At least one technology is required')
    .max(10, 'Maximum 10 technologies allowed'),
  client: z
    .string()
    .min(1, 'Client name is required')
    .max(100, 'Client name must be less than 100 characters'),
  status: z.string().min(1, 'Status is required'),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Start date cannot be in the past'),
  endDate: z.string().optional(),
  projectDescription: z
    .string()
    .min(10, 'Project description must be at least 10 characters')
    .max(500, 'Project description must be less than 500 characters'),
  projectName: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  githubUrls: z.array(z.string()).refine((urls) => {
    return urls.every((url) => !url || url.includes('github.com'));
  }, 'All GitHub URLs must be valid'),
  jiraUrls: z.array(z.string()).refine((urls) => {
    return urls.every((url) => !url || url.includes('jira.') || url.includes('atlassian.net'));
  }, 'All JIRA URLs must be valid'),
  budget: z.number().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical'], {
    required_error: 'Priority is required',
  }),
});

export type CreateTeamFormValues = z.infer<typeof createTeamFormSchema>;
export type UpdateTeamFormValues = z.infer<typeof updateTeamFormSchema>;
export type AddMembersFormValues = z.infer<typeof addMembersFormSchema>;
export type UpdateMemberPositionFormValues = z.infer<typeof updateMemberPositionFormSchema>;
export type TeamFormValues = z.infer<typeof teamFormSchema>;

export const teamSchema = {
  create: createTeamFormSchema,
  update: updateTeamFormSchema,
  addMembers: addMembersFormSchema,
  updatePosition: updateMemberPositionFormSchema,
  team: teamFormSchema,
};

export default teamSchema;
