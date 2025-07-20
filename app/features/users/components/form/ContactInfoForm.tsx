import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { PersonalInfoFormType } from '@app/types/types';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface ContactInfoFormProps {
  register: UseFormRegister<PersonalInfoFormType>;
  errors: FieldErrors<PersonalInfoFormType>;
}

export const ContactInfoForm = ({ register, errors }: ContactInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" placeholder="DD.MM.YYYY." {...register('dateOfBirth')} />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" placeholder="+387 61 234 5678 91" {...register('phoneNumber')} />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      {/* <div className="space-y-2"> */}
      {/*   <Label htmlFor="github">GitHub Profile</Label> */}
      {/*   <Input id="github" placeholder="https://github.com/username" {...register('github')} /> */}
      {/*   {errors.github && <p className="text-sm text-red-500">{errors.github.message}</p>} */}
      {/* </div> */}
      {/**/}
      {/* <div className="space-y-2"> */}
      {/*   <Label htmlFor="linkedin">LinkedIn Profile</Label> */}
      {/*   <Input */}
      {/*     id="linkedin" */}
      {/*     placeholder="https://linkedin.com/in/username" */}
      {/*     {...register('linkedin')} */}
      {/*   /> */}
      {/*   {errors.linkedin && <p className="text-sm text-red-500">{errors.linkedin.message}</p>} */}
      {/* </div> */}
    </div>
  );
};
