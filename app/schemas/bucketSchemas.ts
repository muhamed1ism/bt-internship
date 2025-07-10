import { z } from 'zod';

const createCategoryFormSchema = z.object({
  name: z.string().min(3, 'Bucket name must be at least 3 characters'),
});

const updateCategoryFormSchema = z.object({
  name: z.string().min(3, 'Bucket name must be at least 3 characters'),
});

const createLevelFormSchema = z.object({
  level: z.number().int().min(1),
  expectations: z.array(z.string()),
  skills: z.array(z.string()),
  tools: z.array(z.string()),
  knowledge: z.array(z.string()),
  toAdvance: z.array(z.string()),
});

const updateLevelFormSchema = z.object({
  expectations: z.array(z.string()),
  skills: z.array(z.string()),
  tools: z.array(z.string()),
  knowledge: z.array(z.string()),
  toAdvance: z.array(z.string()),
});

const assignUserBucketsFormSchema = z.object({
  bucketLevelIds: z.array(z.string()).min(1),
});

export type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;
export type UpdateCategoryFormValues = z.infer<typeof updateCategoryFormSchema>;
export type CreateLevelFormValues = z.infer<typeof createLevelFormSchema>;
export type UpdateLevelFormValues = z.infer<typeof updateLevelFormSchema>;
export type AssignUserBucketsFormValues = z.infer<typeof assignUserBucketsFormSchema>;

export const bucketSchema = {
  createCategory: createCategoryFormSchema,
  updateCategory: updateCategoryFormSchema,
  createLevel: createLevelFormSchema,
  updateLevel: updateLevelFormSchema,
  assignUserBuckets: assignUserBucketsFormSchema,
};

export default bucketSchema;
