import { FormInputField } from '@app/components/forms/FormInputField';
import { UpdateProfileFormValues } from '@app/schemas';
import { UseFormReturn } from 'react-hook-form';

interface ContactInfoFormProps {
  form: UseFormReturn<UpdateProfileFormValues>;
}

export const ContactInfoForm = ({ form }: ContactInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInputField control={form.control} name="email" label="Email" />

        <FormInputField control={form.control} name="phoneNumber" label="Phone Number" />
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
