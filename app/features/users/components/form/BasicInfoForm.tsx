import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { experienceLevelType, PersonalInfoFormType } from '@app/types/types';
import { EXPERIENCE_LEVELS } from '@mocks/users';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Label } from '@app/components/ui/label';
import { FormInput } from '@app/components/ui/form-input';

interface BasicInfoFormProps {
  register: UseFormRegister<PersonalInfoFormType>;
  errors: FieldErrors<PersonalInfoFormType>;
  // experienceLevel: experienceLevelType;
  // onExperienceLevelChange: (value: experienceLevelType) => void;
}

export const BasicInfoForm = ({
  register,
  errors,
  // experienceLevel,
  // onExperienceLevelChange,
}: BasicInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          id="firstName"
          label="First Name"
          register={register}
          error={errors.firstName?.message}
        />
        <FormInput
          id="lastName"
          label="Last Name"
          register={register}
          error={errors.lastName?.message}
        />
      </div>

      <FormInput
        id="email"
        label="Email"
        type="email"
        register={register}
        error={errors.email?.message}
      />

      {/* <div className="grid grid-cols-2 gap-4"> */}
      {/*   <FormInput */}
      {/*     id="password" */}
      {/*     label="Password" */}
      {/*     type="password" */}
      {/*     register={register} */}
      {/*     error={errors.password?.message} */}
      {/*   /> */}
      {/*   <FormInput */}
      {/*     id="confirmPassword" */}
      {/*     label="Confirm Password" */}
      {/*     type="password" */}
      {/*     register={register} */}
      {/*     error={errors.confirmPassword?.message} */}
      {/*   /> */}
      {/* </div> */}

      {/* <div className="space-y-2"> */}
      {/*   <Label htmlFor="experienceLevel">Experience Level</Label> */}
      {/*   <Select value={experienceLevel} onValueChange={onExperienceLevelChange}> */}
      {/*     <SelectTrigger> */}
      {/*       <SelectValue placeholder="Select experience level" /> */}
      {/*     </SelectTrigger> */}
      {/*     <SelectContent> */}
      {/*       {EXPERIENCE_LEVELS.map((level) => ( */}
      {/*         <SelectItem key={level.value} value={level.value}> */}
      {/*           {level.label} */}
      {/*         </SelectItem> */}
      {/*       ))} */}
      {/*     </SelectContent> */}
      {/*   </Select> */}
      {/* </div> */}
    </div>
  );
};
