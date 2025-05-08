import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserType, PersonalInfoFormType } from '@app/types/types';

export function usePersonalInfoForm(user: UserType | null) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoFormType>({
    mode: 'onTouched',
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
        dateOfBirth: '01.02.1993.',
        phoneNumber: '+387 61 234 5678 91',
        experienceLevel: 'medior',
        github: '',
        linkedin: '',
        password: '',
        confirmPassword: '',
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
