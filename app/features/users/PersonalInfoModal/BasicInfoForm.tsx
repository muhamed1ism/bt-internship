import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { PersonalInfoFormType } from '@app/types/types';

interface BasicInfoFormProps {
  register: UseFormRegister<PersonalInfoFormType>;
  errors: FieldErrors<PersonalInfoFormType>;
  experienceLevel: string;
  onExperienceLevelChange: (value: string) => void;
}

export const BasicInfoForm = ({
  register,
  errors,
  experienceLevel,
  onExperienceLevelChange,
}: BasicInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register('firstName')} />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register('lastName')} />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experienceLevel">Experience Level</Label>
        <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="intern">Intern (0-1 Yr.)</SelectItem>
            <SelectItem value="junior">Junior (1-2 Yr.)</SelectItem>
            <SelectItem value="medior">Medior (2-5 Yr.)</SelectItem>
            <SelectItem value="senior">Senior (5+ Yr.)</SelectItem>
            <SelectItem value="lead">Lead (8+ Yr.)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
