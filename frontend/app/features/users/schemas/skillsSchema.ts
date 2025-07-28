import { z } from 'zod';

export const skillsSchema = z.object({
  skills: z.array(z.string().min(1, 'Skill name is required')),
  topics: z.array(z.string().min(1, 'Topic name is required')),
  buckets: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      level: z.number().min(1).max(5),
    }),
  ),
  resumeFile: z.instanceof(File).optional().nullable(),
  biographyFile: z.instanceof(File).optional().nullable(),
});

export type SkillsFormType = z.infer<typeof skillsSchema>;
