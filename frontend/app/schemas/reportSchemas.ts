import { z } from 'zod';

const createReportFormSchema = z.object({
  content: z.string().min(10, 'Report content must be at least 10 characters'),
});

const updateReportFormSchema = z.object({
  content: z.string().min(10, 'Report content must be at least 10 characters'),
});

export type CreateReportFormValues = z.infer<typeof createReportFormSchema>;
export type UpdateReportFormValues = z.infer<typeof updateReportFormSchema>;

export const reportSchema = {
  create: createReportFormSchema,
  update: updateReportFormSchema,
};

export default reportSchema;
