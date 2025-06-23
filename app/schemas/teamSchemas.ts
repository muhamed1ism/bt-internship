import { z } from 'zod';

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

export type TeamFormValues = z.infer<typeof teamFormSchema>;

export const teamSchema = {
  team: teamFormSchema,
};

export default teamSchema;
