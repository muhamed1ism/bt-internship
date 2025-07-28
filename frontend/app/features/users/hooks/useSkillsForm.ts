import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@app/types/types';
import { skillsSchema, SkillsFormType } from '../schemas/skillsSchema';
import { zodResolver } from '@hookform/resolvers/zod';

export function useSkillsForm(user: User | null) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SkillsFormType>({
    mode: 'onTouched',
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: [],
      topics: [],
      buckets: [],
      resumeFile: null,
      biographyFile: null,
    },
  });

  useEffect(() => {
    if (user) {
      // Initialize with default values for demo (extend UserType later to include these properties)
      reset({
        skills: ['Backend', 'Frontend', 'DevOps'],
        topics: ['React', 'NestJS', 'Postgres'],
        buckets: [
          { id: 'software-engineer', name: 'Software Engineer', level: 5 },
          { id: 'frontend-developer', name: 'Frontend Developer', level: 3 },
        ],
        resumeFile: null,
        biographyFile: null,
      });
    }
  }, [user, reset]);

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    errors,
  };
}
