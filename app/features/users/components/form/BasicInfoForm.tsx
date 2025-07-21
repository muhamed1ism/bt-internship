import { FieldErrors, UseFormRegister, UseFormReturn } from 'react-hook-form';
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
import { UpdateProfileFormValues } from '@app/schemas';
import { FormInputField } from '@app/components/forms/FormInputField';
import { FormDatePicker } from '@app/components/forms/FormDatePicker';

interface BasicInfoFormProps {
  form: UseFormReturn<UpdateProfileFormValues>;
  // experienceLevel: experienceLevelType;
  // onExperienceLevelChange: (value: experienceLevelType) => void;
}

export const BasicInfoForm = ({
  form,
  // experienceLevel,
  // onExperienceLevelChange,
}: BasicInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInputField control={form.control} name="firstName" label="First Name" />

        <FormInputField control={form.control} name="lastName" label="Last Name" />
      </div>

      <FormDatePicker control={form.control} name="dateOfBirth" label="Date of Birth" />

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
