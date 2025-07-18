import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, PersonalInfoFormType } from '@app/types/types';
import { personalInfoSchema } from '../schemas/personalInfoSchema';
import { zodResolver } from '@hookform/resolvers/zod';

export function usePersonalInfoForm(user: User | null) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoFormType>({
    mode: 'onTouched',
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      phoneNumber: '',
      experienceLevel: 'medior',
      github: '',
      linkedin: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth ?? '',
        phoneNumber: user.phoneNumber ?? '',
        experienceLevel:
          (user.experienceLevel as 'intern' | 'junior' | 'medior' | 'senior' | 'lead') ?? 'medior',
        github: user.github ?? '',
        linkedin: user.linkedin ?? '',
        password: user.password ?? '',
        confirmPassword: user.password ?? '',
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
