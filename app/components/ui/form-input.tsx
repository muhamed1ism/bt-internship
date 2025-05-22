import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { UseFormRegister } from 'react-hook-form';
import { PersonalInfoFormType } from '@app/types/types';

interface FormInputProps {
  id: keyof PersonalInfoFormType;
  label: string;
  type?: string;
  register: UseFormRegister<PersonalInfoFormType>;
  error?: string;
}

export const FormInput = ({ id, label, type = 'text', register, error }: FormInputProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type={type} {...register(id)} aria-invalid={!!error} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
