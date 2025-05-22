import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

interface FormInputFieldProps {
  control: Control<any>;
  type?: string;
  name: string;
  label: string;
}

export const FormInputField = ({ control, type = 'text', name, label }: FormInputFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Input
              type={type}
              placeholder={label}
              className="border-primary/50 border-1"
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
